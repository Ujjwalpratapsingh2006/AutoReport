import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { useFetchWithAuth } from '../hooks/useFetchWithAuth';

export default function Dashboard() {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const fetchWithAuth = useFetchWithAuth();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;
        
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetchWithAuth('/api/research/start', {
                method: 'POST',
                body: JSON.stringify({ topic: topic.trim() })
            });

            if (response.error) {
                setError(response.error);
                return;
            }

            navigate(`/research/${response.sessionId}`);
        } catch (err) {
            setError("Failed to start research.");
        } finally {
            setIsLoading(false);
        }
    };

    const sampleTopics = [
        "Impact of AI on healthcare diagnostics",
        "History of quantum computing",
        "Economic effects of global tariffs"
    ];

    return (
        <div className="min-h-full w-full flex flex-col items-center justify-center p-6 bg-sec-dark relative overflow-hidden font-sans">
            
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-sec-cyan rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-sec-teal rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-float-delayed"></div>
            </div>

            {/* Header Section */}
            <div className="text-center z-10 w-full max-w-2xl mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    What would you like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-sec-cyan to-sec-teal drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">report</span> on today?
                </h1>
                <p className="text-slate-400 text-lg mb-8 font-light">
                    Enter any topic and our autonomous agent will scour the web to synthesize a report.
                </p>

                {/* Search Box */}
                <form onSubmit={handleSearch} className="relative mb-8 group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-slate-500 group-focus-within:text-sec-cyan transition-colors drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                    </div>
                    <input
                        type="text"
                        className="w-full glass-panel border border-white/10 text-white rounded-2xl pl-14 pr-40 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-sec-cyan/50 focus:border-sec-cyan transition-all placeholder:text-slate-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                        placeholder="E.g., FDA regulations on AI medical devices..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <button
                            type="submit"
                            disabled={isLoading || !topic.trim()}
                            className="bg-gradient-to-r from-sec-cyan to-sec-teal text-sec-darker font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Generate Report"
                            )}
                        </button>
                    </div>
                </form>

                {/* Error State */}
                {error && (
                    <div className="mb-6 flex items-center justify-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl glass-panel">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Sample Pills */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Examples:</span>
                    {sampleTopics.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTopic(t)}
                            className="px-5 py-2 rounded-full glass-panel text-slate-300 text-sm hover:bg-white/10 hover:text-white hover:border-sec-cyan/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all cursor-pointer font-light"
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
