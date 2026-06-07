import { useEffect, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Download, Loader2, QrCode as QrCodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadWorkflowQrPdf, generateWorkflowQrDataUrl } from '@/lib/qrCode';

interface QrCodeDialogProps {
  workflowId: string | null
  workflowName: string
  onClose: () => void
}

export default function QrCodeDialog({ workflowId, workflowName, onClose }: QrCodeDialogProps) {
  const isOpen = workflowId !== null
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workflowId) {
      setDataUrl(null)
      setError(null)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    generateWorkflowQrDataUrl(workflowId)
      .then((url) => {
        if (!cancelled) setDataUrl(url)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to generate QR code')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [workflowId])

  const handleDownload = async () => {
    if (!workflowId) return
    setIsDownloading(true)
    try {
      await downloadWorkflowQrPdf(workflowId, workflowName)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[min(420px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 shadow-lg outline-none data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <QrCodeIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-semibold tracking-tight">Workflow QR</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm text-muted-foreground truncate" title={workflowName}>
                {workflowName || 'Untitled workflow'}
              </Dialog.Description>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center gap-4 rounded-xl border bg-muted/40 p-6">
            {isLoading ? (
              <div className="flex h-56 w-56 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex h-56 w-56 items-center justify-center px-4 text-center text-sm text-destructive">
                {error}
              </div>
            ) : dataUrl ? (
              <img
                src={dataUrl}
                alt={`QR code for ${workflowName}`}
                className="h-56 w-56 rounded-lg bg-white p-2"
              />
            ) : null}

            <p className="text-center text-xs text-muted-foreground">
              Scanning this code with the Steps web app opens the workflow.
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close
              render={(props) => (
                <Button {...props} type="button" variant="outline" disabled={isDownloading}>
                  Close
                </Button>
              )}
            />
            <Button
              type="button"
              onClick={handleDownload}
              disabled={!dataUrl || isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
