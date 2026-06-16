import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, RefreshCw, FileText, Loader2, Star } from "lucide-react";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";
import { useAuth } from "../context/AuthContext";
import GraphVisualizer from "../components/GraphVisualizer";
import ReportViewer from "../components/ReportViewer";
import PlanApproval from "../components/PlanApproval";

export default function ResearchPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const fetchWithAuth = useFetchWithAuth();
    const { accessToken } = useAuth();

    const [session, setSession] = useState(null);
    const [status, setStatus] = useState("loading");
    const [events, setEvents] = useState([]);
    const [activeNode, setActiveNode] = useState(null);
    const [completedNodes, setCompletedNodes] = useState(new Set());
    const [error, setError] = useState(null);
    const [criticScore, setCriticScore] = useState(0);
    const [searchCount, setSearchCount] = useState(0);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const data = await fetchWithAuth(`/api/research/sessions/${sessionId}`);
                if (data.error) {
                    setError(data.error);
                    setStatus("error");
                    return;
                }
                setSession(data);

                if (data.nodeLog && data.nodeLog.length > 0) {
                    setEvents(data.nodeLog);
                    const completed = new Set();
                    let sc = 0;
                    data.nodeLog.forEach(ev => {
                        completed.add(ev.node);
                        if (ev.node === "search") sc++;
                        if (ev.node === "critic" && ev.data?.score) setCriticScore(ev.data.score);
                    });
                    setCompletedNodes(completed);
                    setSearchCount(sc);
                }

                if (data.status === "completed") {
                    setStatus("completed");
                    setCriticScore(data.criticScore || 0);
                } else if (data.status === "failed") {
                    setStatus("error");
                    setError("Research failed.");
                } else if (data.status === "planning") {
                    setStatus("planning");
                    setActiveNode("human");
                    setCompletedNodes(new Set(["plan"]));
                } else if (data.status === "approved" || data.status === "running") {
                    setStatus("running");
                    setCompletedNodes(prev => new Set([...prev, "plan", "human"]));
                    startSSE();
                }
            } catch (err) {
                setError("Failed to fetch session.");
                setStatus("error");
            }
        };

        fetchInitial();

        return () => {
            if (window.activeEventSource) {
                window.activeEventSource.close();
                window.activeEventSource = null;
            }
        };
    }, [sessionId]);

    const handleApprove = async (approvedPlan) => {
        setStatus("approving");
        try {
            const response = await fetchWithAuth(`/api/research/${sessionId}/approve`, {
                method: "POST",
                body: JSON.stringify({ approvedPlan })
            });

            if (response.error) {
                setError(response.error);
                setStatus("error");
                return;
            }

            setSession(prev => ({ ...prev, researchPlan: approvedPlan, status: "approved" }));
            setCompletedNodes(prev => new Set([...prev, "human"]));
            setStatus("running");
            startSSE();
        } catch (err) {
            setError("Failed to approve plan.");
            setStatus("error");
        }
    };

    const startSSE = () => {
        if (window.activeEventSource) {
            window.activeEventSource.close();
            window.activeEventSource = null;
        }

        const sseUrl = `http://localhost:8080/api/research/stream/${sessionId}?token=${encodeURIComponent(accessToken)}`;
        const sse = new EventSource(sseUrl);
        window.activeEventSource = sse;
        let streamDone = false;

        sse.addEventListener("node_update", (e) => {
            const data = JSON.parse(e.data);
            setActiveNode(data.node);
            setCompletedNodes(prev => new Set([...prev, data.node]));
            setEvents(prev => [...prev, data]);

            if (data.node === "search") {
                setSearchCount(prev => prev + 1);
            }
            if (data.node === "critic" && data.data?.score) {
                setCriticScore(data.data.score);
            }
        });

        sse.addEventListener("complete", (e) => {
            streamDone = true;
            const data = JSON.parse(e.data);
            setSession(data.session);
            setStatus("completed");
            setCriticScore(data.session.criticScore || 0);
            setActiveNode(null);
            sse.close();
            window.activeEventSource = null;
        });

        sse.addEventListener("error", (e) => {
            if (streamDone) return;
            if (e.data) {
                try {
                    const errData = JSON.parse(e.data);
                    setError(errData.message);
                } catch {}
                streamDone = true;
                setStatus("error");
                sse.close();
                window.activeEventSource = null;
            }
        });
    };

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center bg-sec-dark font-sans">
                <div className="text-center glass-panel p-8 rounded-2xl">
                    <p className="text-rose-400 mb-6">{error}</p>
                    <button onClick={() => navigate("/dashboard")} className="px-6 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors font-medium">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const getStatusDisplay = () => {
        switch (status) {
            case "loading": return { icon: <Loader2 className="w-3 h-3 animate-spin text-slate-400" />, text: "Loading..." };
            case "planning": return { icon: <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse inline-block" />, text: "Awaiting your approval" };
            case "approving": return { icon: <Loader2 className="w-3 h-3 animate-spin text-amber-400" />, text: "Approving plan..." };
            case "running": return { icon: <RefreshCw className="w-3 h-3 animate-spin text-sec-cyan" />, text: "Agent is generating..." };
            case "completed": return { icon: <CheckCircle className="w-3 h-3 text-sec-teal" />, text: "Report Complete" };
            default: return { icon: null, text: "" };
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <div className="flex flex-col h-full bg-sec-dark overflow-hidden font-sans">
            {/* Header */}
            <div className="flex-shrink-0 h-16 border-b border-white/5 bg-white/5 backdrop-blur-md px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-sec-cyan hover:bg-white/5 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight tracking-tight">
                            {session?.topic || "Loading..."}
                        </h1>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                                {statusDisplay.icon} {statusDisplay.text}
                            </span>
                            {status === "completed" && (
                                <>
                                    <span>•</span>
                                    <span>{session?.totalSearches || searchCount} searches</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-400" />
                                        Critic: {criticScore}/10
                                    </span>
                                    {(session?.revisionCount || 0) > 0 && (
                                        <>
                                            <span>•</span>
                                            <span>{session.revisionCount} revision{session.revisionCount > 1 ? "s" : ""}</span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Graph Visualizer & Logs */}
                <div className="w-2/5 border-r border-white/5 flex flex-col bg-white/[0.02]">
                    <div className="flex-1 overflow-hidden flex items-center justify-center p-4 border-b border-white/5 relative">
                        <GraphVisualizer
                            activeNode={activeNode}
                            completedNodes={completedNodes}
                            status={status}
                            criticScore={criticScore}
                            searchCount={searchCount}
                        />
                    </div>

                    {/* Activity Log */}
                    <div className="h-56 flex-shrink-0 bg-sec-darker p-4 overflow-y-auto font-mono text-xs border-t border-white/5 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]">
                        <div className="text-sec-cyan mb-2 uppercase text-xs font-bold tracking-widest opacity-80">Agent Activity Log</div>
                        {events.map((ev, idx) => (
                            <div key={idx} className="mb-1.5 flex items-start gap-2 group">
                                <span className={`font-bold flex-shrink-0 ${
                                    ev.node === "critic" ? "text-violet-400 drop-shadow-[0_0_2px_rgba(167,139,250,0.5)]" :
                                    ev.node === "human" ? "text-amber-400 drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]" :
                                    "text-sec-teal drop-shadow-[0_0_2px_rgba(20,184,166,0.5)]"
                                }`}>[{ev.node}]</span>
                                <span className="text-slate-300 group-hover:text-white transition-colors">
                                    {ev.node === "plan" && `Generated ${ev.data?.questions?.length || 0} sub-questions`}
                                    {ev.node === "human" && `Plan approved (${ev.data?.questionCount || 0} questions)`}
                                    {ev.node === "search" && `Searched: "${ev.data?.query}"`}
                                    {ev.node === "synthesize" && `Merged ${ev.data?.totalResults || 0} results → ${ev.data?.uniqueSources || 0} unique sources`}
                                    {ev.node === "write" && `Report drafted (revision ${ev.data?.revision || 0})`}
                                    {ev.node === "critic" && (
                                        ev.data?.action === "accepted" || ev.data?.action?.includes("auto-accepted")
                                            ? `✓ Score: ${ev.data?.score}/10 — Accepted`
                                            : `⟳ Score: ${ev.data?.score}/10 — Revision requested`
                                    )}
                                </span>
                            </div>
                        ))}
                        {status === "running" && (
                            <div className="flex items-center gap-2 text-sec-cyan/70 animate-pulse mt-2">
                                <RefreshCw className="w-3 h-3 animate-spin" /> Processing...
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-3/5 bg-sec-dark overflow-y-auto relative">
                    {/* Subtle background glow for right panel */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sec-cyan/5 via-sec-dark to-sec-dark"></div>
                    
                    <div className="relative z-10 h-full">
                        {status === "planning" && session?.researchPlan?.length > 0 ? (
                            <PlanApproval
                                questions={session.researchPlan}
                                onApprove={handleApprove}
                                isLoading={status === "approving"}
                            />
                        ) : status === "completed" && session?.report ? (
                            <ReportViewer
                                report={session.report}
                                sources={session.sources}
                                topic={session.topic}
                                criticScore={criticScore}
                                revisionCount={session.revisionCount}
                                maxRevisionsReached={session.maxRevisionsReached}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                                <div className="relative">
                                    <FileText className="w-16 h-16 mb-6 opacity-20" />
                                    {status === "running" && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-full bg-sec-cyan/10 blur-xl rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black text-slate-300 mb-3 tracking-tight">
                                    {status === "running" ? "Agent is Generating..." : "Loading..."}
                                </h3>
                                <p className="max-w-md font-light text-slate-400">
                                    {status === "running"
                                        ? "Searching the web in parallel, synthesizing results, and generating your report. Watch the graph on the left for live progress."
                                        : "Fetching session data..."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
