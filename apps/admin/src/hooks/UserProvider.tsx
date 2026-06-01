import { useEffect, useState, type ReactNode } from 'react'
import { authService, type AuthUser } from '../services/authService'
import { UserContext } from './userContext'

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getStoredUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setUser(null)
    }
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const { user } = await authService.login(username, password)
      setUser(user)
    } catch (error) {
      console.error('Login failed', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  )
}
