import { LayoutTemplate } from 'lucide-react'

function NavBar() {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 shadow-sm z-50 relative">
      <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
        <LayoutTemplate className="h-5 w-5 text-white" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">Steps Admin</h1>
    </nav>
  )
}

export default NavBar
