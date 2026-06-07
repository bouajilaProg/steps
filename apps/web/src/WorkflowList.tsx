import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { workflowService, type Workflow, type Step } from './services/workflowService';

export default function WorkflowList() {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [covers, setCovers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        workflowService
            .getWorkflows()
            .then(async (data) => {
                if (cancelled) return;
                setWorkflows(data);

                const coverEntries = await Promise.all(
                    data.map(async (wf) => {
                        try {
                            const steps: Step[] = await workflowService.getSteps(wf.id);
                            const first = steps
                                .slice()
                                .sort((a, b) => a.stepOrder - b.stepOrder)[0];
                            return [wf.id, first?.imageUrl ?? first?.imagePath ?? ''] as const;
                        } catch {
                            return [wf.id, ''] as const;
                        }
                    }),
                );

                if (!cancelled) {
                    setCovers(Object.fromEntries(coverEntries));
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Failed to load workflows');
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="min-h-[100dvh] bg-[#111111] text-white p-6 font-sans">
            <div className="max-w-md mx-auto pt-12">
                <h1 className="text-3xl font-bold mb-2">Workflows</h1>
                <p className="text-white/60 mb-8">Select a process to start</p>

                {loading ? (
                    <p className="text-white/40 text-sm">Loading...</p>
                ) : error ? (
                    <p className="text-red-400 text-sm">{error}</p>
                ) : workflows.length === 0 ? (
                    <p className="text-white/40 text-sm">no workflow is present</p>
                ) : (
                    <div className="space-y-4">
                        {workflows.map((wf) => (
                            <Link
                                key={wf.id}
                                to={`/process/${wf.id}`}
                                className="block relative overflow-hidden rounded-2xl aspect-[2/1] group transition-transform active:scale-95"
                            >
                                {covers[wf.id] ? (
                                    <img
                                        src={covers[wf.id]}
                                        alt={wf.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-white/5" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                                <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                                    <h2 className="text-xl font-bold text-white shadow-sm">
                                        {wf.name || '\u00A0'}
                                    </h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
