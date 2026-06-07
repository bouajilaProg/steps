import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import type { Workflow } from '@/services/workflowService'
import WorkflowActionsMenu from './WorkflowActionsMenu'

interface WorkflowItemProps {
  workflow: Workflow
  onRename: () => void
  onDelete: () => void
}

export default function WorkflowItem({ workflow, onRename, onDelete }: WorkflowItemProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-1" title={workflow.name}>
          {workflow.name}
        </CardTitle>
        <CardDescription>
          Created: {new Date(workflow.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        <Link
          to={`/edit/${workflow.id}`}
          className={buttonVariants({ variant: "secondary", className: "flex-1" })}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Link>
        <WorkflowActionsMenu onRename={onRename} onDelete={onDelete} />
      </CardFooter>
    </Card>
  )
}
