export interface Workflow {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Step {
  id: string;
  workflowId: string;
  text: string;
  imagePath: string;
  imageUrl?: string;
  stepOrder: number;
  createdAt: string;
  updatedAt: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

async function request<T>(path: string): Promise<T> {
  if (!apiUrl) {
    throw new Error('API URL is missing');
  }

  const response = await fetch(`${apiUrl}${path}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${response.status})`);
  }

  return response.json();
}

export const workflowService = {
  getWorkflows: (): Promise<Workflow[]> => request<Workflow[]>('/public/workflows'),
  getWorkflowById: (id: string): Promise<Workflow> => request<Workflow>(`/public/workflows/${id}`),
  getSteps: (workflowId: string): Promise<Step[]> => request<Step[]>(`/public/workflows/${workflowId}/steps`),
};
