import { createContext, useContext, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'

interface User {
  username: string
  token: string
  [key: string]: any
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (username: string, password: string) => Promise<void>
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const loggedInUser = await authService.login(username, password) as User
      setUser(loggedInUser)
    } catch (error) {
      console.error('Login failed', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
