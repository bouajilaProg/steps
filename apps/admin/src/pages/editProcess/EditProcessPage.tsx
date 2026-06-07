import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ControlBar from "./components/ControlBar"
import ProcessEditor from "./components/ProcessEditor"
import PreviewDialog from "./components/PreviewDialog"
import NavBar from "../../components/NavBar"
import { workflowService, type SyncStepData } from "../../services/workflowService"
import type { Step } from "./components/StepItem"
import { Loader2 } from "lucide-react"

function EditProcessPage() {
  const { processId } = useParams<{ processId: string }>()
  const navigate = useNavigate()

  const [processName, setProcessName] = useState("")
  const [steps, setSteps] = useState<Step[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!processId || processId === 'new') {
        // Handle new workflow creation scenario if needed, but currently assuming processId exists
        // If it's a new one, we might need a separate 'create' step before adding steps, or sync can handle it
        setIsLoading(false)
        return
      }

      try {
        const workflow = await workflowService.getWorkflowById(processId)
        if (workflow) {
          setProcessName(workflow.name)
          const fetchedSteps = await workflowService.getSteps(processId)
          const formattedSteps = fetchedSteps.map(s => ({
            id: s.id,
            title: s.text,
            imageUrl: s.imageUrl ?? s.imagePath,
            imagePath: s.imagePath,
          }))
          setSteps(formattedSteps)
        }
      } catch (err) {
        console.error("Failed to load workflow", err)
      }

      setIsLoading(false)
    }
    loadData()
  }, [processId])

  const handleSave = async () => {
    if (!processId) return
    setIsSaving(true)

    try {
      const syncSteps: SyncStepData[] = steps.map((s, idx) => ({
        id: s.id,
        text: s.title,
        imagePath: s.file ? undefined : s.imagePath ?? s.imageUrl,
        imageMimeType: s.file ? s.file.type : undefined,
        stepOrder: idx
      }))

      const response = await workflowService.syncWorkflow(processId, processName, syncSteps)

      // Upload newly added files
      const stepsById = new Map(steps.map(step => [step.id, step]))
      await Promise.all(response.uploadLinks.map(link => {
        const matchedStep = stepsById.get(link.stepId)
        if (matchedStep && matchedStep.file) {
          return workflowService.uploadStepImage(link.uploadUrl, matchedStep.file)
        }
      }))

      navigate('/')
    } catch (err) {
      console.error("Error saving workflow", err)
      alert("Failed to save. Please try again.")
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <ControlBar
        processName={processName}
        onProcessNameChange={setProcessName}
        onSave={handleSave}
        onCancel={() => navigate('/')}
        onPreview={() => setIsPreviewOpen(true)}
        isSaving={isSaving}
      />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative">
        {isSaving && (
          <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Uploading assets and saving...</p>
          </div>
        )}
        <ProcessEditor steps={steps} setSteps={setSteps} />
      </main>
      {isPreviewOpen && processId && (
        <PreviewDialog
          workflowId={processId}
          workflowName={processName}
          steps={steps}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  )
}

export default EditProcessPage
