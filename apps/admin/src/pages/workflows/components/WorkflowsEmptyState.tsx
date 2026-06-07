import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface WorkflowsEmptyStateProps {
  onCreateFirst: () => void
}

export default function WorkflowsEmptyState({ onCreateFirst }: WorkflowsEmptyStateProps) {
  return (
    <div className="text-center p-12 border rounded-lg bg-muted/20">
      <p className="text-muted-foreground">No workflows found.</p>
      <Button variant="outline" className="mt-4" onClick={onCreateFirst}>
        <Plus className="mr-2 h-4 w-4" /> Create your first workflow
      </Button>
    </div>
  )
}
