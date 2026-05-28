import { Eye, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ControlBarProps {
  processName: string
  onProcessNameChange: (name: string) => void
}

function ControlBar({ processName, onProcessNameChange }: ControlBarProps) {
  return (
    <>
      {/* Desktop: top bar */}
      <div className="hidden md:flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4 items-center justify-between gap-6 relative z-40">
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
        <div className="flex items-center gap-3 flex-shrink-0">
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

      {/* Mobile: process name (top, stacked) */}
      <div className="md:hidden px-4 pt-6 pb-2">
        <label htmlFor="processName-mobile" className="block text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
          Process Name
        </label>
        <Input 
          id="processName-mobile"
          type="text" 
          value={processName}
          onChange={(e) => onProcessNameChange(e.target.value)}
          placeholder="e.g. Emergency Intake"
          className="w-full"
        />
      </div>

      {/* Mobile: fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around py-2 px-2">
          <button className="flex flex-col items-center gap-0.5 py-1 px-3 text-muted-foreground hover:text-foreground transition-colors">
            <Eye className="h-5 w-5" />
            <span className="text-[10px] font-medium">Preview</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 py-1 px-3 text-muted-foreground hover:text-destructive transition-colors">
            <X className="h-5 w-5" />
            <span className="text-[10px] font-medium">Cancel</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 py-1 px-3 text-muted-foreground hover:text-primary transition-colors">
            <Save className="h-5 w-5" />
            <span className="text-[10px] font-medium">Save</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default ControlBar
