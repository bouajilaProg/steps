import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from '@/components/ui/card'
import type { Workflow } from '@/services/workflowService'
import WorkflowActionsMenu from './WorkflowActionsMenu'

interface WorkflowItemProps {
  workflow: Workflow
  onRename: () => void
  onDelete: () => void
  onShowQr: () => void
}

export default function WorkflowItem({ workflow, onRename, onDelete, onShowQr }: WorkflowItemProps) {
  return (
    <Card className="relative transition-shadow hover:shadow-md">
      <Link
        to={`/edit/${workflow.id}`}
        className="absolute inset-0 z-0 rounded-[inherit]"
        aria-label={`Edit ${workflow.name}`}
      />
      <CardHeader>
        <CardTitle className="line-clamp-1" title={workflow.name}>
          {workflow.name}
        </CardTitle>
        <CardDescription>
          Created: {new Date(workflow.createdAt).toLocaleDateString()}
        </CardDescription>
        <CardAction className="relative z-10">
          <WorkflowActionsMenu onRename={onRename} onDelete={onDelete} onShowQr={onShowQr} />
        </CardAction>
      </CardHeader>
    </Card>
  )
}
