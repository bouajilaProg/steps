interface WorkflowsErrorProps {
  message: string
}

export default function WorkflowsError({ message }: WorkflowsErrorProps) {
  return (
    <div className="text-center p-12 border rounded-lg bg-destructive/5 text-destructive">
      {message}
    </div>
  )
}
