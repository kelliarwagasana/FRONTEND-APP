import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loginWithApi, registerWithApi } from '../authApi'
import { getCurrentUser, logout as logoutUser, subscribeToAuthChange } from '../authStorage'
import type { AuthResult, LoginCredentials, RegisterCredentials, User } from '../types'

interface AuthContextValue {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<AuthResult>
  loginWithGoogle: () => Promise<AuthResult>
  register: (credentials: RegisterCredentials) => Promise<AuthResult>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser())

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser())
    }

    const unsubscribe = subscribeToAuthChange(handleAuthChange)
    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (credentials: LoginCredentials) => {
        const result = await loginWithApi(credentials)
        if (result.success) {
          setUser(result.user)
        }
        return result
      },
      loginWithGoogle: async () => ({
        success: false,
        error: 'Google sign-in is not available yet. Use email and password.',
      }),
      register: async (credentials: RegisterCredentials) => {
        const result = await registerWithApi(credentials)
        if (result.success) {
          setUser(result.user)
        }
        return result
      },
      logout: () => {
        logoutUser()
        setUser(null)
      },
      isAuthenticated: user !== null,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }

