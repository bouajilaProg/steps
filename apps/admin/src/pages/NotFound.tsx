import { useNavigate } from 'react-router-dom'
import { Droplets, Home } from 'lucide-react'
import { Button } from '../components/ui/button'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <Droplets className="h-16 w-16 text-red-500" />
          </div>
        </div>
        <h1 className="text-7xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl font-semibold text-gray-600 mb-2">Error 404: Vein Not Found</p>
        <p className="text-gray-500 mb-8">
          We drew a blank on this request. This page seems to have flatlined,
          but there's no need to call a code blue. Let's get you back to safety.
        </p>
        <Button onClick={() => navigate('/')} className="inline-flex items-center">
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}

export default NotFound
