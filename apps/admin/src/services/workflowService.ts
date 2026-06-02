export interface Workflow {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// Static mock data
const mockWorkflows: Workflow[] = [
  {
    id: "wf_1",
    title: "Blood Donation Protocol",
    createdAt: new Date(Date.now() - 100000000).toISOString(),
    updatedAt: new Date(Date.now() - 50000000).toISOString(),
  },
  {
    id: "wf_2",
    title: "Plasma Extraction",
    createdAt: new Date(Date.now() - 200000000).toISOString(),
    updatedAt: new Date(Date.now() - 150000000).toISOString(),
  },
  {
    id: "wf_3",
    title: "Centrifuge Usage Guide",
    createdAt: new Date(Date.now() - 300000000).toISOString(),
    updatedAt: new Date(Date.now() - 250000000).toISOString(),
  },
];

export const workflowService = {
  getWorkflows: async (): Promise<Workflow[]> => {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockWorkflows]);
      }, 500);
    });
  },
  getWorkflowById: async (id: string): Promise<Workflow | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockWorkflows.find((p) => p.id === id));
      }, 300);
    });
  },
  createWorkflow: async (title: string): Promise<Workflow> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        const suffix = Math.random().toString(36).slice(2, 7);
        const newWorkflow: Workflow = {
          id: `wf_${slug || 'workflow'}_${suffix}`,
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockWorkflows.unshift(newWorkflow);
        resolve(newWorkflow);
      }, 400);
    });
  }
};
