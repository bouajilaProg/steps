import { useState, type FormEvent } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RenameWorkflowDialogProps {
  workflowId: string | null
  initialName: string
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (id: string, name: string) => void
}

export default function RenameWorkflowDialog({
  workflowId,
  initialName,
  isSubmitting,
  onClose,
  onSubmit,
}: RenameWorkflowDialogProps) {
  const [name, setName] = useState(initialName)

  const isOpen = workflowId !== null
  const trimmed = name.trim()
  const canSubmit = trimmed.length > 0 && !isSubmitting

  const handleClose = () => {
    if (isSubmitting) return
    setName(initialName)
    onClose()
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!workflowId || !canSubmit) return
    onSubmit(workflowId, trimmed)
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[min(420px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 shadow-lg outline-none data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95">
          <Dialog.Title className="text-lg font-semibold tracking-tight">Rename workflow</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-muted-foreground">
            Choose a new title for this workflow.
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div className="space-y-2">
              <label htmlFor="workflow-name" className="text-sm font-medium leading-none">
                Workflow name
              </label>
              <Input
                id="workflow-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g., Blood Donation Protocol"
                autoFocus
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Dialog.Close
                render={(props) => (
                  <Button
                    {...props}
                    type="button"
                    variant="outline"
                    onClick={(event) => {
                      props.onClick?.(event)
                      handleClose()
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
              />
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
