import { Eye, Save, X } from 'lucide-react'

interface ControlBarProps {
  processName: string
  onProcessNameChange: (name: string) => void
}

function ControlBar({ processName, onProcessNameChange }: ControlBarProps) {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-40">
      <div className="flex items-center gap-4 w-full flex-1">
        <label htmlFor="processName" className="text-sm font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
          Process Name
        </label>
        <input 
          id="processName"
          type="text" 
          value={processName}
          onChange={(e) => onProcessNameChange(e.target.value)}
          placeholder="e.g. Emergency Intake"
          className="text-base font-semibold text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 focus:border-indigo-500 rounded-xl px-4 py-2.5 transition-all outline-none w-full max-w-sm focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
        />
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-shrink-0">
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 focus:outline-none transition-all shadow-sm hover:shadow">
          <Eye className="h-4 w-4" />
          Preview
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 focus:outline-none transition-all shadow-sm hover:shadow">
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 focus:outline-none transition-all shadow-sm hover:shadow hover:-translate-y-0.5">
          <Save className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  )
}

export default ControlBar
