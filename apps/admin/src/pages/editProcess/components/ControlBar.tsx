import { Eye, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ControlBarProps {
  processName: string
  onProcessNameChange: (name: string) => void
}

function ControlBar({ processName, onProcessNameChange }: ControlBarProps) {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-40">
      <div className="flex items-center gap-4 w-full flex-1">
        <label htmlFor="processName" className="text-sm font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
          Process Name
        </label>
        <Input 
          id="processName"
          type="text" 
          value={processName}
          onChange={(e) => onProcessNameChange(e.target.value)}
          placeholder="e.g. Emergency Intake"
          className="w-full max-w-sm"
        />
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-shrink-0">
        <Button variant="outline" size="default">
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button variant="outline" size="default" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button size="default">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  )
}

export default ControlBar
