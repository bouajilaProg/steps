import { createContext } from 'react'
import type { AuthUser } from '../services/authService'

export interface UserContextType {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export const UserContext = createContext<UserContextType | undefined>(undefined)
