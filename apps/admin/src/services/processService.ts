export interface Process {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// Static mock data
const mockProcesses: Process[] = [
  {
    id: "proc_1",
    title: "Blood Donation Protocol",
    createdAt: new Date(Date.now() - 100000000).toISOString(),
    updatedAt: new Date(Date.now() - 50000000).toISOString(),
  },
  {
    id: "proc_2",
    title: "Plasma Extraction",
    createdAt: new Date(Date.now() - 200000000).toISOString(),
    updatedAt: new Date(Date.now() - 150000000).toISOString(),
  },
  {
    id: "proc_3",
    title: "Centrifuge Usage Guide",
    createdAt: new Date(Date.now() - 300000000).toISOString(),
    updatedAt: new Date(Date.now() - 250000000).toISOString(),
  },
];

export const processService = {
  getProcesses: async (): Promise<Process[]> => {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockProcesses]);
      }, 500);
    });
  },
  getProcessById: async (id: string): Promise<Process | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProcesses.find((p) => p.id === id));
      }, 300);
    });
  },
  createProcess: async (title: string): Promise<Process> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        const suffix = Math.random().toString(36).slice(2, 7);
        const newProcess: Process = {
          id: `proc_${slug || 'process'}_${suffix}`,
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockProcesses.unshift(newProcess); // Add to the top
        resolve(newProcess);
      }, 400);
    });
  }
};
