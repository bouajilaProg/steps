import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { workflowService, type Workflow } from '../../services/workflowService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button, buttonVariants } from '../../components/ui/button';
import { Plus, Edit } from 'lucide-react';
import NavBar from '../../components/NavBar';
import { CreateWorkflowModal } from '../../components/CreateWorkflowModal';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    workflowService.getWorkflows().then((data) => {
      setWorkflows(data);
      setLoading(false);
    });
  }, []);

  const handleCreateWorkflow = async (title: string) => {
    setIsCreating(true);
    try {
      const newWorkflow = await workflowService.createWorkflow(title);
      setIsModalOpen(false);
      navigate(`/edit/${newWorkflow.id}`);
    } catch (error) {
      console.error('Failed to create workflow', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <main className="flex-1 p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
              <p className="text-muted-foreground mt-1">Manage your visual step-by-step guides.</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Workflow
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12 text-muted-foreground">Loading workflows...</div>
          ) : workflows.length === 0 ? (
            <div className="text-center p-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No workflows found.</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create your first workflow
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="line-clamp-1" title={workflow.title}>
                      {workflow.title}
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
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateWorkflowModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateWorkflow}
        isSubmitting={isCreating}
      />
    </div>
  );
}