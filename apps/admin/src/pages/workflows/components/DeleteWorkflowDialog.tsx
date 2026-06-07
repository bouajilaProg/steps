import { Dialog } from '@base-ui/react/dialog'
import { Button } from '@/components/ui/button'

interface DeleteWorkflowDialogProps {
  workflowId: string | null
  workflowName: string
  isSubmitting: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export default function DeleteWorkflowDialog({
  workflowId,
  workflowName,
  isSubmitting,
  onClose,
  onConfirm,
}: DeleteWorkflowDialogProps) {
  const isOpen = workflowId !== null

  const handleClose = () => {
    if (isSubmitting) return
    onClose()
  }

  const handleConfirm = () => {
    if (!workflowId || isSubmitting) return
    onConfirm(workflowId)
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
          <Dialog.Title className="text-lg font-semibold tracking-tight">Delete workflow</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">"{workflowName}"</span>? This action cannot be undone.
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
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
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
