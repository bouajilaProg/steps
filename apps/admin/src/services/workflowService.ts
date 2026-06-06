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
  stepOrder: number;
}

export interface SyncStepData {
  id?: string;
  text?: string;
  imagePath?: string;
  imageMimeType?: string;
  stepOrder: number;
}

export interface SyncWorkflowResponse {
  workflowId: string;
  uploadLinks: { stepId: string; uploadUrl: string }[];
}

const apiUrl = import.meta.env.VITE_API_URL;


async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiUrl) {
    throw new Error('API URL is missing');
  }

  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('unauthorized');
    }
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Workflow request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const workflowService = {
  getWorkflows: async (): Promise<Workflow[]> => {
    return request<Workflow[]>('/workflow');
  },
  getWorkflowById: async (id: string): Promise<Workflow | undefined> => {
    return request<Workflow>(`/workflow/${id}`);
  },
  createWorkflow: async (name: string): Promise<Workflow> => {
    return request<Workflow>('/workflow', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
  getSteps: async (workflowId: string): Promise<Step[]> => {
    return request<Step[]>(`/steps/workflow/${workflowId}`);
  },
  syncWorkflow: async (workflowId: string, name: string, steps: SyncStepData[]): Promise<SyncWorkflowResponse> => {
    return request<SyncWorkflowResponse>(`/workflow/${workflowId}/sync`, {
      method: 'POST',
      body: JSON.stringify({ name, steps }),
    });
  },
  uploadStepImage: async (uploadUrl: string, file: File): Promise<void> => {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Image upload failed (${response.status})${body ? `: ${body}` : ''}`);
    }
  }
};
