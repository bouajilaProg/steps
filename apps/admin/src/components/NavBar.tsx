import { LayoutTemplate, LogOut } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { useUser } from '../hooks/useUser'

function NavBar() {
  const { user, logout } = useUser()

  return (
    <nav className="bg-background border-b px-6 py-3 flex items-center gap-3 shadow-sm z-50 relative">
      <div className="bg-primary p-1.5 rounded-lg">
        <LayoutTemplate className="h-5 w-5 text-primary-foreground" />
      </div>
      <h1 className="text-xl font-bold tracking-tight">Steps Admin</h1>
      <div className="ml-auto flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.username ?? 'Admin'}&background=random`} />
          <AvatarFallback>{user?.username?.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
        </Avatar>
        <button
          onClick={logout}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}

export default NavBar
