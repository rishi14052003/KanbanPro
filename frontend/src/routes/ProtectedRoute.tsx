import { Navigate } from 'react-router-dom'
import { authService } from '../services/authService'

interface ProtectedRouteProps {
  children: React.ReactNode
  public?: boolean // If true, allows access only when NOT authenticated (for login/signup)
}

function ProtectedRoute({ children, public: isPublic = false }: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated()

  // For public routes (login/signup): redirect to dashboard if already logged in
  if (isPublic && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // For protected routes: redirect to login if not authenticated
  if (!isPublic && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
