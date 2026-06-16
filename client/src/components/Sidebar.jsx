import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Search, LogOut, Plus, FileText } from "lucide-react";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { sessionId } = useParams();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const fetchWithAuth = useFetchWithAuth();
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const fetchSessions = async () => {
            const data = await fetchWithAuth("/api/research/sessions");
            if (data && !data.error) {
                setSessions(data);
            }
        };
        fetchSessions();
    }, [sessionId]);

    return (
        <div className="w-64 bg-sec-darker border-r border-white/5 flex flex-col h-full flex-shrink-0 transition-all font-sans">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center gap-2 text-sec-cyan hover:text-sec-teal font-bold text-lg tracking-tight transition-colors">
                    <Search className="w-5 h-5 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" />
                    AutoReport
                </Link>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
                <Link 
                    to="/dashboard"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-sec-cyan to-sec-teal text-sec-darker rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" />
                    New Report
                </Link>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                    Report History
                </div>
                
                {sessions.length === 0 ? (
                    <div className="text-sm text-slate-500 px-2 italic">No recent sessions</div>
                ) : (
                    sessions.map((session) => (
                        <Link
                            key={session._id}
                            to={`/research/${session._id}`}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                sessionId === session._id
                                    ? "bg-sec-cyan/10 text-sec-cyan font-bold border border-sec-cyan/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <div className="truncate">
                                {session.topic}
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center justify-between text-sm">
                    <div className="truncate text-slate-400 font-light">
                        {user?.email}
                    </div>
                    <button 
                        onClick={logout}
                        className="p-1.5 text-slate-400 hover:text-sec-cyan hover:bg-sec-cyan/10 rounded-md transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
