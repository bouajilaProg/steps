import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import type { Workflow } from '@/services/workflowService'

interface WorkflowItemProps {
  workflow: Workflow
}

export default function WorkflowItem({ workflow }: WorkflowItemProps) {
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
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(workflow.updatedAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter>
        <Link to={`/edit/${workflow.id}`} className={buttonVariants({ variant: "secondary", className: "w-full" })}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Link>
      </CardFooter>
    </Card>
  )
}
