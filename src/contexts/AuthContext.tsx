import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api } from '../services/api'

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (login: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 启动时检查已有 token
  useEffect(() => {
    const token = api.getToken()
    if (token) {
      api.getMe()
        .then((data) => setUser(data.user))
        .catch(() => { api.logout(); setUser(null) })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (loginStr: string, password: string) => {
    setError(null)
    try {
      const data = await api.login(loginStr, password)
      setUser(data.user)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const register = useCallback(async (username: string, email: string, password: string) => {
    setError(null)
    try {
      const data = await api.register(username, email, password)
      setUser(data.user)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    api.logout()
    setUser(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, login, register, logout, error, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
