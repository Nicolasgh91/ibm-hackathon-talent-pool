import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authService } from '@/services/authService'
import type { User, LoginRequest, RegisterRequest } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const token = authService.getToken()
      const savedUser = authService.getUser()

      if (token && savedUser) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
          authService.saveUser(currentUser)
        } catch (error) {
          // Token is invalid, clear storage
          authService.logout()
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials)
    authService.saveToken(response.token)
    authService.saveUser(response.user)
    setUser(response.user)
  }

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data)
    authService.saveToken(response.token)
    authService.saveUser(response.user)
    setUser(response.user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const refreshUser = async () => {
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
    authService.saveUser(currentUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Made with Bob