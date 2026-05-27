import { Eye, Save, X } from 'lucide-react'

interface ControlBarProps {
  processName: string
  onProcessNameChange: (name: string) => void
}

function ControlBar({ processName, onProcessNameChange }: ControlBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <input 
        type="text" 
        value={processName}
        onChange={(e) => onProcessNameChange(e.target.value)}
        placeholder="Process Name (e.g. Emergency Intake)" 
        className="text-xl font-bold text-gray-900 placeholder:text-gray-400 border-0 border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-600 focus:ring-0 px-0 bg-transparent min-w-[300px] transition-colors outline-none"
      />
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          <Eye className="h-4 w-4" />
          Preview
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm">
          <Save className="h-4 w-4" />
          Save Process
        </button>
      </div>
    </div>
  )
}

export default ControlBar
