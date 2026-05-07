import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Zap } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { authService } from '../../services/authService'
import taskManagerImage from '../../assets/task-manager.jpg'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
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
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
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
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)

    try {
      const response = await authService.login(formData)
      authService.setToken(response.token)
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo/Branding */}
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-text-primary mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-lg text-text-secondary font-medium">Sign in to your TaskForge workspace</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-pulse">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-danger mr-2" />
                  <p className="text-sm text-danger font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                icon={<Mail className="w-5 h-5 text-text-secondary" />}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    setFieldErrors({ ...fieldErrors, password: undefined })
                  }}
                  required
                  error={fieldErrors.password}
                  icon={<Lock className="w-5 h-5 text-text-secondary" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-10 text-text-secondary hover:text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-text-secondary">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:text-secondary font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full group"
                isLoading={isLoading}
              >
                <span className="flex items-center justify-center">
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-text-secondary">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary hover:text-secondary font-semibold transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-text-secondary text-sm mt-8">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:text-secondary font-medium transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:text-secondary font-medium transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-purple-600 to-secondary items-center justify-center p-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="text-center relative z-10">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full animate-bounce">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <img 
            src={taskManagerImage} 
            alt="Task Management" 
            className="w-full max-w-lg mx-auto mb-10 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500"
          />
          <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Manage your tasks in an easy and more efficient way with TaskForge
          </h2>
          <p className="text-white/90 text-xl font-medium leading-relaxed">
            Streamline your workflow, collaborate with your team, and achieve your goals faster.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
            <div className="w-8 h-1 bg-white/50 rounded-full"></div>
            <div className="w-4 h-1 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
