import React from "react";
import { Brain, Search, GitMerge, FileText, Eye, User } from "lucide-react";

export default function GraphVisualizer({ activeNode, completedNodes, status, criticScore, searchCount }) {

    const isRevising = criticScore > 0 && criticScore < 7 && activeNode === "write";

    const getNodeStyle = (nodeId) => {
        const isCompleted = completedNodes.has(nodeId);
        const isActive = activeNode === nodeId;

        if (isActive) {
            // Special amber glow for Write node during a revision
            if (nodeId === "write" && isRevising) {
                return "bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.25)]";
            }
            return "bg-emerald-500/20 border-emerald-500 text-emerald-300 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.25)]";
        }
        if (isCompleted) {
            return "bg-emerald-500/15 border-emerald-500/50 text-emerald-400";
        }
        return "bg-slate-800/40 border-slate-700/60 text-slate-500";
    };

    const getHumanStyle = () => {
        const isCompleted = completedNodes.has("human");
        const isActive = activeNode === "human";
        if (isActive) return "bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.25)]";
        if (isCompleted) return "bg-amber-500/15 border-amber-500/50 text-amber-400";
        return "bg-slate-800/40 border-slate-700/60 text-slate-500";
    };

    const getCriticStyle = () => {
        const isCompleted = completedNodes.has("aggregateCritic");
        const isActive = activeNode === "aggregateCritic";
        if (isActive) return "bg-violet-500/20 border-violet-500 text-violet-300 animate-pulse shadow-[0_0_20px_rgba(139,92,246,0.25)]";
        if (isCompleted) return "bg-violet-500/15 border-violet-500/50 text-violet-400";
        return "bg-slate-800/40 border-slate-700/60 text-slate-500";
    };

    // Dynamic search nodes: show actual count from events, or fallback to plan count
    const displaySearchCount = Math.max(searchCount, 1);

    return (
        <div className="w-full flex flex-col items-center gap-0 py-2 select-none">

            {/* Plan */}
            <div className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-bold transition-all duration-300 ${getNodeStyle("plan")}`}>
                <Brain className="w-4 h-4" /> Plan
            </div>

            {/* Connector */}
            <div className="w-px h-5 bg-slate-700"></div>

            {/* Approve (Human) */}
            <div className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-bold transition-all duration-300 ${getHumanStyle()}`}>
                <User className="w-4 h-4" /> Approve
            </div>

            {/* Fan-out connector */}
            <div className="relative w-full flex justify-center" style={{ height: "28px" }}>
                <svg className="absolute w-full h-full" viewBox="0 0 300 28" preserveAspectRatio="xMidYMid meet">
                    {/* Vertical stem */}
                    <line x1="150" y1="0" x2="150" y2="10" stroke="#334155" strokeWidth="2" />
                    {/* Horizontal bar */}
                    {displaySearchCount > 1 && (
                        <line
                            x1={150 - (displaySearchCount - 1) * 25}
                            y1="10"
                            x2={150 + (displaySearchCount - 1) * 25}
                            y2="10"
                            stroke="#334155"
                            strokeWidth="2"
                        />
                    )}
                    {/* Drop-down lines to each search node */}
                    {Array.from({ length: displaySearchCount }).map((_, i) => {
                        const x = displaySearchCount === 1 ? 150 : 150 - (displaySearchCount - 1) * 25 + i * 50;
                        return <line key={i} x1={x} y1="10" x2={x} y2="28" stroke="#334155" strokeWidth="2" />;
                    })}
                </svg>
            </div>

            {/* Search Nodes (dynamic) */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
                {Array.from({ length: displaySearchCount }).map((_, i) => (
                    <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-lg text-xs font-bold transition-all duration-300 ${getNodeStyle("search")}`}>
                        <Search className="w-3 h-3" /> S{i + 1}
                    </div>
                ))}
            </div>

            {/* Fan-in connector */}
            <div className="relative w-full flex justify-center" style={{ height: "28px" }}>
                <svg className="absolute w-full h-full" viewBox="0 0 300 28" preserveAspectRatio="xMidYMid meet">
                    {/* Rise-up lines from each search node */}
                    {Array.from({ length: displaySearchCount }).map((_, i) => {
                        const x = displaySearchCount === 1 ? 150 : 150 - (displaySearchCount - 1) * 25 + i * 50;
                        return <line key={i} x1={x} y1="0" x2={x} y2="18" stroke="#334155" strokeWidth="2" />;
                    })}
                    {/* Horizontal bar */}
                    {displaySearchCount > 1 && (
                        <line
                            x1={150 - (displaySearchCount - 1) * 25}
                            y1="18"
                            x2={150 + (displaySearchCount - 1) * 25}
                            y2="18"
                            stroke="#334155"
                            strokeWidth="2"
                        />
                    )}
                    {/* Down to synthesize */}
                    <line x1="150" y1="18" x2="150" y2="28" stroke="#334155" strokeWidth="2" />
                </svg>
            </div>

            {/* Synthesize */}
            <div className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-bold transition-all duration-300 ${getNodeStyle("synthesize")}`}>
                <GitMerge className="w-4 h-4" /> Synthesize
            </div>

            {/* Connector */}
            <div className="w-px h-5 bg-slate-700"></div>

            {/* Write -> Reviewers -> Aggregate Critic with Revision Loop */}
            <div className="relative flex flex-col items-center gap-0 w-full">
                {/* Write Node */}
                <div className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-bold transition-all duration-300 ${getNodeStyle("write")}`}>
                    <FileText className="w-4 h-4" /> Write
                </div>
                
                {/* Fan-out to Reviewers */}
                <div className="relative w-full flex justify-center" style={{ height: "20px" }}>
                    <svg className="absolute w-full h-full" viewBox="0 0 300 20" preserveAspectRatio="xMidYMid meet">
                        <line x1="150" y1="0" x2="150" y2="10" stroke="#334155" strokeWidth="2" />
                        <line x1="100" y1="10" x2="200" y2="10" stroke="#334155" strokeWidth="2" />
                        <line x1="100" y1="10" x2="100" y2="20" stroke="#334155" strokeWidth="2" />
                        <line x1="150" y1="10" x2="150" y2="20" stroke="#334155" strokeWidth="2" />
                        <line x1="200" y1="10" x2="200" y2="20" stroke="#334155" strokeWidth="2" />
                    </svg>
                </div>

                {/* 3 Peer Reviewer Nodes */}
                <div className="flex items-center justify-center gap-4">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-lg text-xs font-bold transition-all duration-300 ${getNodeStyle("reviewer")}`}>
                        <Eye className="w-3 h-3" /> Fact
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-lg text-xs font-bold transition-all duration-300 ${getNodeStyle("reviewer")}`}>
                        <Eye className="w-3 h-3" /> Edit
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 border-2 rounded-lg text-xs font-bold transition-all duration-300 ${getNodeStyle("reviewer")}`}>
                        <Eye className="w-3 h-3" /> SME
                    </div>
                </div>

                {/* Fan-in to Aggregate Critic */}
                <div className="relative w-full flex justify-center" style={{ height: "20px" }}>
                    <svg className="absolute w-full h-full" viewBox="0 0 300 20" preserveAspectRatio="xMidYMid meet">
                        <line x1="100" y1="0" x2="100" y2="10" stroke="#334155" strokeWidth="2" />
                        <line x1="150" y1="0" x2="150" y2="10" stroke="#334155" strokeWidth="2" />
                        <line x1="200" y1="0" x2="200" y2="10" stroke="#334155" strokeWidth="2" />
                        <line x1="100" y1="10" x2="200" y2="10" stroke="#334155" strokeWidth="2" />
                        <line x1="150" y1="10" x2="150" y2="20" stroke="#334155" strokeWidth="2" />
                    </svg>
                </div>

                {/* Aggregate Critic Node */}
                <div className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-bold transition-all duration-300 ${getCriticStyle()}`}>
                    <GitMerge className="w-4 h-4" /> Aggregate Critic
                    {criticScore > 0 && (
                        <span className={`ml-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                            criticScore >= 7 ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                        }`}>
                            {criticScore}/10
                        </span>
                    )}
                </div>

                {/* Loop arrow absolutely positioned to the right covering Write to Aggregate */}
                <svg 
                    width="40" 
                    height="120" 
                    viewBox="0 0 40 120" 
                    className={`absolute transition-all duration-300 ${isRevising ? 'drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]' : ''}`} 
                    style={{ right: "10%", top: 0, marginTop: "10px" }}
                >
                    <path 
                        d="M 4 100 C 35 100, 35 15, 4 15" 
                        stroke={isRevising ? "#f59e0b" : "#334155"} 
                        strokeWidth="2" 
                        fill="none" 
                        strokeDasharray="4 3" 
                        className={isRevising ? "animate-pulse" : ""}
                    />
                    <polygon 
                        points="4,11 0,19 8,19" 
                        fill={isRevising ? "#f59e0b" : "#334155"} 
                        className={isRevising ? "animate-pulse" : ""}
                    />
                </svg>
            </div>

        </div>
    );
}
