import { Eye, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ControlBarProps {
  processName: string
  onProcessNameChange: (name: string) => void
  onSave: () => void
  onCancel: () => void
  onPreview: () => void
  isSaving: boolean
}

function ControlBar({ processName, onProcessNameChange, onSave, onCancel, onPreview, isSaving }: ControlBarProps) {
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
          {/* Preview Button */}
          <Button variant="outline" size="default" onClick={onPreview} disabled={isSaving}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>

          {/* Cancel Button (Force Red Hover) */}
          <Button
            variant="outline"
            size="default"
            className="border-destructive/50 text-destructive hover:!bg-destructive hover:!text-destructive-foreground transition-colors"
            onClick={onCancel}
            disabled={isSaving}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>

          {/* Save Button */}
          <Button
            size="default"
            className="active:scale-95 transition-all duration-200 shadow-sm"
            onClick={onSave}
            disabled={isSaving || !processName}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t-2 border-black rounded-t-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around py-2 px-2">
          <button
            type="button"
            onClick={onPreview}
            disabled={isSaving}
            className="flex flex-col items-center gap-0.5 py-1 px-3 text-black hover:text-black/70 transition-colors disabled:opacity-50"
          >
            <Eye className="h-5 w-5" />
            <span className="text-[10px] font-semibold text-black">Preview</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex flex-col items-center gap-0.5 py-1 px-3 text-black hover:text-destructive transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
            <span className="text-[10px] font-semibold text-black">Cancel</span>
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !processName}
            className="flex flex-col items-center gap-0.5 py-1 px-3 text-black hover:text-black/70 transition-colors disabled:opacity-50 active:scale-95"
          >
            <Save className="h-5 w-5" />
            <span className="text-[10px] font-semibold text-black">{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default ControlBar
