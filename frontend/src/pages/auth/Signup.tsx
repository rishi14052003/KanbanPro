import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowRight, Check, Eye, EyeOff, Shield, Sparkles } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { authService } from '../../services/authService'
import taskManagerImage from '../../assets/task-manager.jpg'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    const errors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
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

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })
      authService.setToken(response.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'Contains number or special character', met: /[0-9!@#$%^&*]/.test(formData.password) }
  ]

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo/Branding */}
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-text-primary mb-3 tracking-tight">Create Account</h1>
            <p className="text-lg text-text-secondary font-medium">Start your productivity journey with TaskForge</p>
          </div>

          {/* Signup Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-pulse">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-danger mr-2" />
                  <p className="text-sm text-danger font-medium">{error}</p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setFieldErrors({ ...fieldErrors, name: undefined })
                }}
                required
                error={fieldErrors.name}
                icon={<User className="w-5 h-5 text-text-secondary" />}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  setFieldErrors({ ...fieldErrors, email: undefined })
                }}
                required
                error={fieldErrors.email}
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

              {/* Password Requirements */}
              {formData.password && (
                <div className="space-y-2 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-medium text-text-secondary mb-2">Password requirements:</p>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${req.met ? 'bg-success text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {req.met && <Check className="w-3 h-3" />}
                      </div>
                      <span className={req.met ? 'text-success' : 'text-text-secondary'}>{req.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value })
                    setFieldErrors({ ...fieldErrors, confirmPassword: undefined })
                  }}
                  required
                  error={fieldErrors.confirmPassword || (formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : '')}
                  icon={<Lock className="w-5 h-5 text-text-secondary" />}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-10 text-text-secondary hover:text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-offset-0 mt-1 cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-text-secondary cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-secondary font-medium transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:text-secondary font-medium transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full group"
                isLoading={isLoading}
              >
                <span className="flex items-center justify-center">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-text-secondary">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-secondary font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-text-secondary text-sm mt-8">
            Join thousands of teams already using TaskForge
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
            <Sparkles className="w-10 h-10 text-white" />
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

export default Signup
