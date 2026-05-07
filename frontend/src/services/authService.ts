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
    return response.data
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', credentials)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token)
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  }
}
