import { useState, useEffect, useMemo } from 'react'
import { workflowService } from '../../../services/workflowService'
import type { Step } from './StepItem'
import ProcessViewer, { type PreviewStep } from './ProcessViewer'

interface PreviewDialogProps {
  workflowId: string
  workflowName: string
  steps: Step[]
  onClose: () => void
}

function PreviewDialog({ workflowId, workflowName, steps, onClose }: PreviewDialogProps) {
  const [urlByPath, setUrlByPath] = useState<Record<string, string>>({})

  const pathsToResolve = useMemo(
    () => Array.from(new Set(steps.filter((s) => !s.imageUrl && s.imagePath).map((s) => s.imagePath as string))),
    [steps],
  )

  useEffect(() => {
    if (pathsToResolve.length === 0) return

    let cancelled = false

    async function resolve() {
      try {
        const fetched = await workflowService.getSteps(workflowId)
        if (cancelled) return
        const next: Record<string, string> = {}
        for (const f of fetched) {
          if (f.imagePath && f.imageUrl) {
            next[f.imagePath] = f.imageUrl
          }
        }
        if (!cancelled) {
          setUrlByPath(next)
        }
      } catch (err) {
        if (cancelled) return
        console.error('Failed to resolve signed URLs for preview', err)
      }
    }

    resolve()

    return () => {
      cancelled = true
    }
  }, [pathsToResolve, workflowId])

  const signedSteps: PreviewStep[] = useMemo(
    () =>
      steps.map((s, idx) => ({
        id: s.id,
        text: s.title,
        imageUrl: s.imageUrl ?? (s.imagePath ? urlByPath[s.imagePath] : undefined),
        imagePath: s.imagePath,
        stepOrder: idx,
      })),
    [steps, urlByPath],
  )

  return (
    <div
      className="fixed inset-0 z-[200] bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Workflow preview"
    >
      <ProcessViewer
        workflow={{ id: workflowId, name: workflowName }}
        steps={signedSteps}
        onClose={onClose}
      />
    </div>
  )
}

export default PreviewDialog
