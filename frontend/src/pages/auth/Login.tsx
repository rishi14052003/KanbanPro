import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/authService'
import taskManagerImage from '../../assets/task-manager.jpg'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const response = await authService.login(formData)
      authService.setToken(response.token)
      if (rememberMe) localStorage.setItem('rememberMe', 'true')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputCls = (err?: string) =>
    `auth-input ${err ? 'auth-input--error' : ''}`

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* ── Left: form panel ── */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">

            {/* Logo */}
            <div className="auth-logo">
              <div className="auth-logo-mark">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1L16.5 5.25V12.75L9 17L1.5 12.75V5.25L9 1Z" fill="white" fillOpacity="0.9"/>
                  <path d="M9 5L13 7.5V12.5L9 15L5 12.5V7.5L9 5Z" fill="white" fillOpacity="0.4"/>
                </svg>
              </div>
              <span className="auth-logo-text">TaskForge</span>
            </div>

            {/* Heading */}
            <div className="auth-heading-group">
              <h1 className="auth-heading">Welcome back</h1>
              <p className="auth-subheading">Sign in to continue to your workspace</p>
            </div>

            {/* Error */}
            {error && (
              <div className="auth-error-banner">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">

              {/* Email */}
              <div className="auth-field">
                <label className="auth-label">Email address</label>
                <div className="auth-input-wrapper">
                  <Mail className="auth-input-icon" size={15} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      setFieldErrors({ ...fieldErrors, email: undefined })
                    }}
                    className={inputCls(fieldErrors.email)}
                  />
                </div>
                {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-input-icon" size={15} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      setFieldErrors({ ...fieldErrors, password: undefined })
                    }}
                    className={`${inputCls(fieldErrors.password)} auth-input--has-trail`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="auth-input-trail-btn"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}
              </div>

              {/* Remember + Forgot */}
              <div className="auth-row-between">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="auth-checkbox"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="auth-link auth-link--sm">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading} className="auth-submit-btn">
                {isLoading ? (
                  <svg className="auth-spinner" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} className="auth-btn-arrow" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom link */}
            <p className="auth-footer-text">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link auth-link--bold">Create one free</Link>
            </p>
          </div>
        </div>

        {/* ── Right: visual panel ── */}
        <div className="auth-visual-panel">
          <div className="auth-visual-blobs">
            <div className="auth-blob auth-blob--1" />
            <div className="auth-blob auth-blob--2" />
            <div className="auth-blob auth-blob--3" />
          </div>

          <div className="auth-visual-content">
            <div className="auth-visual-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L10.47 5.82L16 6.64L12 10.54L12.94 16L8 13.27L3.06 16L4 10.54L0 6.64L5.53 5.82L8 1Z" fill="white"/>
              </svg>
              Trusted by 50,000+ teams
            </div>

            <div className="auth-visual-image-frame">
              <img src={taskManagerImage} alt="TaskForge dashboard" className="auth-visual-image" />
              <div className="auth-visual-image-shine" />
            </div>

            <div className="auth-visual-text">
              <h2 className="auth-visual-heading">
                Every great team runs<br />on great tasks
              </h2>
              <p className="auth-visual-body">
                Streamline your workflow, keep your team aligned, and ship faster — all from one place.
              </p>
            </div>

            <div className="auth-visual-stats">
              {[
                { value: '3×', label: 'Faster delivery' },
                { value: '98%', label: 'Team satisfaction' },
                { value: '0', label: 'Missed deadlines' },
              ].map((s) => (
                <div key={s.label} className="auth-stat">
                  <span className="auth-stat-value">{s.value}</span>
                  <span className="auth-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login