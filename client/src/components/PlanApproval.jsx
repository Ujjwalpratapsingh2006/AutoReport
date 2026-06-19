import React, { useState } from "react";
import { X, Plus, ArrowRight, Loader2 } from "lucide-react";

export default function PlanApproval({ questions, onApprove, isLoading }) {
    const [plan, setPlan] = useState([...questions]);

    const updateQuestion = (idx, value) => {
        const next = [...plan];
        next[idx] = value;
        setPlan(next);
    };

    const removeQuestion = (idx) => {
        if (plan.length <= 1) return; // Don't allow empty plan
        setPlan(plan.filter((_, i) => i !== idx));
    };

    const addQuestion = () => {
        if (plan.length >= 5) return; // Cap at 5
        setPlan([...plan, ""]);
    };

    const handleApprove = () => {
        const filtered = plan.filter(q => q.trim().length > 0);
        if (filtered.length === 0) return;
        onApprove(filtered);
    };

    return (
        <div className="h-full flex items-center justify-center p-8 bg-sec-dark relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            
            <div className="w-full max-w-xl relative z-10 glass-panel p-8 rounded-3xl border-t border-white/20 shadow-2xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                        HUMAN-IN-THE-LOOP
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Review Report Plan</h2>
                    <p className="text-slate-400 text-sm font-light">
                        The AI planner generated these sub-questions. You can edit, reorder, add, or remove them before the agent begins researching.
                    </p>
                </div>

                {/* Questions */}
                <div className="space-y-3 mb-6">
                    {plan.map((q, idx) => (
                        <div key={idx} className="flex items-center gap-2 group">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-sec-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
                                {idx + 1}
                            </div>
                            <input
                                type="text"
                                value={q}
                                onChange={(e) => updateQuestion(idx, e.target.value)}
                                className="flex-1 glass-panel border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sec-cyan/50 focus:border-sec-cyan transition-all placeholder:text-slate-600"
                                placeholder="Enter a sub-question..."
                            />
                            <button
                                onClick={() => removeQuestion(idx)}
                                disabled={plan.length <= 1}
                                className="flex-shrink-0 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Button */}
                {plan.length < 5 && (
                    <button
                        onClick={addQuestion}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-sec-cyan transition-colors mb-8 px-2 font-medium"
                    >
                        <Plus className="w-4 h-4" /> Add Question ({plan.length}/5)
                    </button>
                )}

                {/* Approve */}
                <button
                    onClick={handleApprove}
                    disabled={isLoading || plan.filter(q => q.trim()).length === 0}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-sec-cyan to-sec-teal text-sec-darker font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                    {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Approving...</>
                    ) : (
                        <><ArrowRight className="w-5 h-5" /> Approve & Start Generation</>
                    )}
                </button>

                <p className="text-center text-xs text-slate-500 mt-4 font-light">
                    The agent will search all questions in parallel, then generate a cited report.
                </p>
            </div>
        </div>
    );
}
