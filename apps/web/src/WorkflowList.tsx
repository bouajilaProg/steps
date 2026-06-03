import { Link } from 'react-router-dom';

const WORKFLOWS = [
    {
        id: 'proc_123',
        title: 'Morning Routine',
        description: 'Start your day right by hydrating your body and finding focus.',
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=800'
    }
];

export default function WorkflowList() {
    return (
        <div className="min-h-[100dvh] bg-[#111111] text-white p-6 font-sans">
            <div className="max-w-md mx-auto pt-12">
                <h1 className="text-3xl font-bold mb-2">Workflows</h1>
                <p className="text-white/60 mb-8">Select a process to start</p>

                <div className="space-y-4">
                    {WORKFLOWS.map(wf => (
                        <Link
                            key={wf.id}
                            to={`/process/${wf.id}`}
                            className="block relative overflow-hidden rounded-2xl aspect-[2/1] group transition-transform active:scale-95"
                        >
                            <img
                                src={wf.image}
                                alt={wf.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                            <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                                <h2 className="text-xl font-bold text-white shadow-sm">{wf.title}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
