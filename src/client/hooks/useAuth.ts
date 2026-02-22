import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authClient } from '@/lib/auth-client.js'

interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
  refresh: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const result = await authClient.getSession()
      if (result.data?.user) {
        setUser(result.data.user as User)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    try {
      await authClient.signOut()
    } catch {
      // proceed to clear regardless
    }
    setUser(null)
  }, [])

  return { user, loading, logout, refresh }
}
