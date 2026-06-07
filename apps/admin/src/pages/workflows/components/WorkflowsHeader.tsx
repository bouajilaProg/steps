import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface WorkflowsHeaderProps {
  onNewWorkflow: () => void
}

export default function WorkflowsHeader({ onNewWorkflow }: WorkflowsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
        <p className="text-muted-foreground mt-1">Manage your visual step-by-step guides.</p>
      </div>
      <Button onClick={onNewWorkflow}>
        <Plus className="mr-2 h-4 w-4" /> New Workflow
      </Button>
    </div>
  )
}
