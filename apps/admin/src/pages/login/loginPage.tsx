import { Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import { Workflow, CheckCircle2 } from 'lucide-react'
import { useUser } from '../../hooks/useUser'

function LoginPage() {
  const { user } = useUser()

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="h-screen flex bg-gray-50 font-sans overflow-hidden">
      {/* Left section with background image and overlay */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between px-16 py-12 text-white overflow-hidden">
        {/* Abstract medical/hospital team background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2940&auto=format&fit=crop')" }}
        />
        {/* Indigo overlay for readability and brand color */}
        <div className="absolute inset-0 bg-emerald-900/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/50 to-transparent" />

        {/* Top logo area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Workflow className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Steps Admin</span>
        </div>

        {/* Center Welcome text */}
        <div className="relative z-10 my-auto">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Define healthcare <br />
            <span className="text-emerald-300">workflows visually</span>
          </h1>
          <p className="text-lg text-emerald-100 max-w-lg leading-relaxed mb-10">
            Steps empowers doctors and hospital administrators to design, communicate, and optimize clinical workflows using easy-to-understand visual diagrams.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <span>Map intuitive medical workflows</span>
            </div>
            <div className="flex items-center gap-3 text-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <span>Align administration and clinical staff</span>
            </div>
            <div className="flex items-center gap-3 text-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <span>Improve hospital operational efficiency</span>
            </div>
          </div>
        </div>

        {/* Bottom footer area */}
        <div className="relative z-10 flex items-center text-sm text-emerald-200">
          <span>© 2026 Steps Healthcare</span>
        </div>
      </div>

      {/* Right section with login form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-between items-center px-4 sm:px-8 lg:px-12 relative overflow-y-auto">
        
        <div className="w-full max-w-xl relative z-10 flex flex-col h-full min-h-[100dvh] lg:min-h-screen">
          {/* Mobile visible branding/text (flex-1 pushes it to center available space above form) */}
          <div className="lg:hidden flex-1 flex flex-col justify-center items-center text-center mt-12 mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-emerald-600 p-3 rounded-xl shadow-lg shadow-emerald-200">
                <Workflow className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Steps</h1>
            <p className="text-gray-500">Sign in to manage hospital workflows.</p>
          </div>

          <div className="hidden lg:block flex-1"></div>

          <div className="mt-auto w-full flex justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
