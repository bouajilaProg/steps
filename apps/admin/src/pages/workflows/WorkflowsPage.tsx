import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { workflowService, type Workflow } from '../../services/workflowService';
import NavBar from '../../components/NavBar';
import { CreateWorkflowModal } from '../../components/CreateWorkflowModal';
import WorkflowsHeader from './components/WorkflowsHeader';
import WorkflowItem from './components/WorkflowItem';
import WorkflowsEmptyState from './components/WorkflowsEmptyState';
import WorkflowsLoading from './components/WorkflowsLoading';
import WorkflowsError from './components/WorkflowsError';
import RenameWorkflowDialog from './components/RenameWorkflowDialog';
import DeleteWorkflowDialog from './components/DeleteWorkflowDialog';
import QrCodeDialog from './components/QrCodeDialog';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Workflow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);
  const [qrTarget, setQrTarget] = useState<Workflow | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    workflowService
      .getWorkflows()
      .then((data) => {
        setWorkflows(data);
      })
      .catch((error) => {
        setError(error instanceof Error ? error.message : 'Failed to load workflows');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleCreateWorkflow = async (name: string) => {
    setIsCreating(true);
    try {
      const newWorkflow = await workflowService.createWorkflow(name);
      setIsModalOpen(false);
      navigate(`/edit/${newWorkflow.id}`);
    } catch (error) {
      console.error('Failed to create workflow', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRename = useCallback(async (id: string, name: string) => {
    setIsRenaming(true);
    try {
      const updated = await workflowService.updateWorkflow(id, name);
      setWorkflows((current) => current.map((w) => (w.id === id ? updated : w)));
      setRenameTarget(null);
    } catch (error) {
      console.error('Failed to rename workflow', error);
    } finally {
      setIsRenaming(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await workflowService.deleteWorkflow(id);
      setWorkflows((current) => current.filter((w) => w.id !== id));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Failed to delete workflow', error);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <main className="flex-1 p-8">
        <div className="container mx-auto max-w-6xl">
          <WorkflowsHeader onNewWorkflow={() => setIsModalOpen(true)} />

          {loading ? (
            <WorkflowsLoading />
          ) : error ? (
            <WorkflowsError message={error} />
          ) : workflows.length === 0 ? (
            <WorkflowsEmptyState onCreateFirst={() => setIsModalOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <WorkflowItem
                  key={workflow.id}
                  workflow={workflow}
                  onRename={() => setRenameTarget(workflow)}
                  onDelete={() => setDeleteTarget(workflow)}
                  onShowQr={() => setQrTarget(workflow)}
                />
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

      <RenameWorkflowDialog
        key={renameTarget?.id ?? 'rename-dialog-closed'}
        workflowId={renameTarget?.id ?? null}
        initialName={renameTarget?.name ?? ''}
        isSubmitting={isRenaming}
        onClose={() => setRenameTarget(null)}
        onSubmit={handleRename}
      />

      <DeleteWorkflowDialog
        workflowId={deleteTarget?.id ?? null}
        workflowName={deleteTarget?.name ?? ''}
        isSubmitting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <QrCodeDialog
        workflowId={qrTarget?.id ?? null}
        workflowName={qrTarget?.name ?? ''}
        onClose={() => setQrTarget(null)}
      />
    </div>
  );
}
