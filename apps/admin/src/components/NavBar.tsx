import { LayoutTemplate } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

function NavBar() {
  return (
    <nav className="bg-background border-b px-6 py-3 flex items-center gap-3 shadow-sm z-50 relative">
      <div className="bg-primary p-1.5 rounded-lg">
        <LayoutTemplate className="h-5 w-5 text-primary-foreground" />
      </div>
      <h1 className="text-xl font-bold tracking-tight">Steps Admin</h1>
      <div className="ml-auto">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://ui-avatars.com/api/?name=Admin&background=random" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}

export default NavBar
