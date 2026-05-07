import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, Check, Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/authService'
import taskManagerImage from '../../assets/task-manager.jpg'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string; email?: string; password?: string; confirmPassword?: string
  }>({})
  const navigate = useNavigate()

  const passwordRequirements = [
    { text: 'At least 8 characters',               met: formData.password.length >= 8 },
    { text: 'Uppercase letter',                     met: /[A-Z]/.test(formData.password) },
    { text: 'Lowercase letter',                     met: /[a-z]/.test(formData.password) },
    { text: 'Number or special character',          met: /[0-9!@#$%^&*]/.test(formData.password) },
  ]

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {}
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
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
      const response = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
      authService.setToken(response.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputCls = (err?: string) =>
    `auth-input ${err ? 'auth-input--error' : ''}`

  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">

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
              <h1 className="auth-heading">Create your account</h1>
              <p className="auth-subheading">Join 50,000+ teams already using TaskForge</p>
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

              {/* Full name */}
              <div className="auth-field">
                <label className="auth-label">Full name</label>
                <div className="auth-input-wrapper">
                  <User className="auth-input-icon" size={15} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      setFieldErrors({ ...fieldErrors, name: undefined })
                    }}
                    className={inputCls(fieldErrors.name)}
                  />
                </div>
                {fieldErrors.name && <p className="auth-field-error">{fieldErrors.name}</p>}
              </div>

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
                    placeholder="Create a strong password"
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

                {/* Password strength */}
                {formData.password && (
                  <div className="auth-password-strength">
                    <div className="auth-strength-bars">
                      {passwordRequirements.map((_, i) => (
                        <div
                          key={i}
                          className={`auth-strength-bar ${
                            passwordRequirements.filter(r => r.met).length > i ? 'auth-strength-bar--filled' : ''
                          }`}
                          style={{
                            '--bar-color': passwordRequirements.filter(r => r.met).length <= 1
                              ? '#ef4444'
                              : passwordRequirements.filter(r => r.met).length <= 2
                              ? '#f59e0b'
                              : passwordRequirements.filter(r => r.met).length <= 3
                              ? '#3b82f6'
                              : '#22c55e'
                          } as React.CSSProperties}
                        />
                      ))}
                    </div>
                    <div className="auth-req-list">
                      {passwordRequirements.map((req, i) => (
                        <div key={i} className={`auth-req-item ${req.met ? 'auth-req-item--met' : ''}`}>
                          <div className="auth-req-dot">
                            {req.met && <Check size={9} strokeWidth={3} />}
                          </div>
                          {req.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="auth-field">
                <label className="auth-label">Confirm password</label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-input-icon" size={15} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value })
                      setFieldErrors({ ...fieldErrors, confirmPassword: undefined })
                    }}
                    className={`${inputCls(
                      fieldErrors.confirmPassword || (formData.confirmPassword && !passwordsMatch ? 'err' : '')
                    )} auth-input--has-trail`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="auth-input-trail-btn"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {(fieldErrors.confirmPassword || (formData.confirmPassword && !passwordsMatch)) && (
                  <p className="auth-field-error">
                    {fieldErrors.confirmPassword || 'Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="auth-checkbox-label auth-checkbox-label--terms">
                <input type="checkbox" required className="auth-checkbox" />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="auth-link">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                </span>
              </label>

              {/* Submit */}
              <button type="submit" disabled={isLoading} className="auth-submit-btn">
                {isLoading ? (
                  <svg className="auth-spinner" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={16} className="auth-btn-arrow" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom link */}
            <p className="auth-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-link auth-link--bold">Sign in</Link>
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
              Free forever · No credit card needed
            </div>

            <div className="auth-visual-image-frame">
              <img src={taskManagerImage} alt="TaskForge dashboard" className="auth-visual-image" />
              <div className="auth-visual-image-shine" />
            </div>

            <div className="auth-visual-text">
              <h2 className="auth-visual-heading">
                Your team's productivity<br />starts here
              </h2>
              <p className="auth-visual-body">
                Create, assign, and track tasks with ease. Built for teams who value clarity and speed.
              </p>
            </div>

            <div className="auth-visual-stats">
              {[
                { value: '50k+', label: 'Active teams' },
                { value: '4.9★', label: 'App rating' },
                { value: '2min', label: 'Setup time' },
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

export default Signup