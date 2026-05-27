import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../../hooks/useUser'
import { User, Lock, Loader2, ArrowRight, AlertCircle } from 'lucide-react'

function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const { login, loading } = useUser()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    try {
      await login(username, password)
      navigate('/')
    } catch (err: any) {
      if (err.message === 'User not found') {
        setError('Username not found')
      } else if (err.message === 'Wrong password') {
        setError('Incorrect password')
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  return (
    <div className="w-full max-w-xl space-y-10 bg-white px-10 sm:px-16 pt-16 pb-20 lg:pb-[40vh] rounded-t-[2.5rem] shadow-[0_-8px_30px_rgb(0,0,0,0.04)] border border-gray-100 border-b-0">
      <div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          Admin Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your admin credentials below to continue
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 border border-red-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-xl border-0 py-2.5 pl-10 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your username"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-xl border-0 py-2.5 pl-10 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your password"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
