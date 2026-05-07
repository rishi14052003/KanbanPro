import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Zap } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-white flex">

      {/* ── Left column ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 lg:px-16">
        <div className="w-full max-w-md">

          {/* Branding */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-5 shadow-lg">
              <LogIn className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-1 tracking-tight">Welcome back</h1>
            <p className="text-base text-text-secondary">Sign in to your TaskForge workspace</p>
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

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">
                  Email address
                </label>
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
                    className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm text-text-primary bg-gray-50 placeholder:text-gray-400 outline-none transition-all duration-200
                      focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary
                      ${fieldErrors.email ? 'border-red-400 bg-red-50/40' : 'border-gray-200 hover:border-gray-300'}`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">
                  Password
                </label>
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
                    className={`w-full h-11 pl-10 pr-11 rounded-xl border text-sm text-text-primary bg-gray-50 placeholder:text-gray-400 outline-none transition-all duration-200
                      focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary
                      ${fieldErrors.password ? 'border-red-400 bg-red-50/40' : 'border-gray-200 hover:border-gray-300'}`}
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
                {fieldErrors.password && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary accent-primary cursor-pointer"
                  />
                  <span className="text-sm text-text-secondary">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-secondary font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

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
                    Signing in…
                  </span>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-secondary font-semibold transition-colors">
                Sign up for free
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-text-secondary text-xs mt-6">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:text-secondary font-medium transition-colors">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:text-secondary font-medium transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>

      {/* ── Right column ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-purple-600 to-secondary items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="text-center relative z-10 w-full max-w-lg">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full">
            <Zap className="w-8 h-8 text-white" />
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

export default Login