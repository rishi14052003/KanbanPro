import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowRight, Check, Eye, EyeOff, Shield, Sparkles } from 'lucide-react'
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
    { text: 'Contains uppercase letter',            met: /[A-Z]/.test(formData.password) },
    { text: 'Contains lowercase letter',            met: /[a-z]/.test(formData.password) },
    { text: 'Contains number or special character', met: /[0-9!@#$%^&*]/.test(formData.password) },
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

  // Shared input class builder
  const inputCls = (hasError?: string) =>
    `w-full h-11 rounded-xl border text-sm text-text-primary bg-gray-50 placeholder:text-gray-400 outline-none transition-all duration-200
    focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary
    ${hasError ? 'border-red-400 bg-red-50/40' : 'border-gray-200 hover:border-gray-300'}`

  return (
    <div className="min-h-screen bg-white flex">

      {/* ── Left column ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-10 lg:px-16">
        <div className="w-full max-w-md">

          {/* Branding */}
          <div className="mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-5 shadow-lg">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-1 tracking-tight">Create account</h1>
            <p className="text-base text-text-secondary">Start your productivity journey with TaskForge</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

            {/* Error banner */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Full name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-text-secondary pointer-events-none" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      setFieldErrors({ ...fieldErrors, name: undefined })
                    }}
                    className={`${inputCls(fieldErrors.name)} pl-10 pr-4`}
                  />
                </div>
                {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Email address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-text-secondary pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      setFieldErrors({ ...fieldErrors, email: undefined })
                    }}
                    className={`${inputCls(fieldErrors.email)} pl-10 pr-4`}
                  />
                </div>
                {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-text-secondary pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      setFieldErrors({ ...fieldErrors, password: undefined })
                    }}
                    className={`${inputCls(fieldErrors.password)} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}

                {/* Password requirements — outside the relative wrapper */}
                {formData.password && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
                    <p className="text-xs font-medium text-text-secondary mb-1">Password requirements:</p>
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200
                          ${req.met ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                          {req.met && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className={`text-xs transition-colors duration-200 ${req.met ? 'text-green-600' : 'text-text-secondary'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Confirm password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-text-secondary pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value })
                      setFieldErrors({ ...fieldErrors, confirmPassword: undefined })
                    }}
                    className={`${inputCls(
                      fieldErrors.confirmPassword ||
                      (formData.confirmPassword && formData.password !== formData.confirmPassword ? 'err' : '')
                    )} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {(fieldErrors.confirmPassword || (formData.confirmPassword && formData.password !== formData.confirmPassword)) && (
                  <p className="text-xs text-red-500">
                    {fieldErrors.confirmPassword || 'Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-primary cursor-pointer shrink-0"
                />
                <span className="text-sm text-text-secondary leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-secondary font-medium transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:text-secondary font-medium transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2
                  hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-secondary font-semibold transition-colors">
                Sign in
              </Link>
            </div>
          </div>

          <p className="text-center text-text-secondary text-xs mt-6">
            Join thousands of teams already using TaskForge
          </p>
        </div>
      </div>

      {/* ── Right column ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-purple-600 to-secondary items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="text-center relative z-10 w-full max-w-lg">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <img
            src={taskManagerImage}
            alt="Task Management"
            className="w-full mx-auto mb-10 rounded-2xl shadow-2xl"
          />
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Manage your tasks in an easy and more efficient way with TaskForge
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Streamline your workflow, collaborate with your team, and achieve your goals faster.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-10 h-1 bg-white/30 rounded-full" />
            <div className="w-6 h-1 bg-white/50 rounded-full" />
            <div className="w-3 h-1 bg-white/70 rounded-full" />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Signup