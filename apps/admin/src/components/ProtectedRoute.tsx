import { Navigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
