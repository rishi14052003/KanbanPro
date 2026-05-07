import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    authService.setToken(response.data.token)
    authService.setUser(response.data.user)
    return response.data
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', credentials)
    authService.setToken(response.data.token)
    authService.setUser(response.data.user)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token)
  },

  getUser: () => {
    const user = localStorage.getItem('user')
    if (!user || user === 'undefined' || user === 'null') return null
    try {
      return JSON.parse(user)
    } catch {
      return null
    }
  },

  setUser: (user: any) => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}