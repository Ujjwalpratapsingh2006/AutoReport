import React, { useRef } from "react";
import { Download, Star } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import ReportDocument from "./ReportDocument";

export default function ReportViewer({ report, sources, topic, criticScore, revisionCount, maxRevisionsReached }) {
    const documentRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: documentRef,
        documentTitle: `${topic} - AutoReport`,
    });

    return (
        <div className="bg-white min-h-full w-full text-slate-900 flex flex-col">
            {/* Action Bar (hidden in print) */}
            <div className="print:hidden sticky top-0 z-10 bg-slate-100 border-b border-slate-300 px-8 py-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Final Report</span>
                    {/* Critic Score Badge */}
                    {criticScore > 0 && (
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
                            criticScore >= 8 ? "bg-emerald-100 text-emerald-700" :
                            criticScore >= 7 ? "bg-emerald-50 text-emerald-600" :
                            "bg-amber-50 text-amber-700"
                        }`}>
                            <Star className="w-4 h-4" />
                            AI Critic Score: {criticScore}/10
                            {revisionCount > 0 && (
                                <span className="text-xs font-normal ml-1 opacity-70">
                                    ({revisionCount} revision{revisionCount > 1 ? "s" : ""})
                                </span>
                            )}
                        </div>
                    )}
                    {maxRevisionsReached && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-rose-100 text-rose-700">
                            ⚠️ Max retries reached
                        </div>
                    )}
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-sec-cyan to-sec-teal text-sec-darker rounded-md text-sm font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                >
                    <Download className="w-4 h-4" />
                    Export PDF
                </button>
            </div>

            {/* Document Container */}
            <div className="flex-1 bg-slate-100 print:bg-white overflow-y-auto">
                <div className="max-w-4xl mx-auto my-8 bg-white shadow-xl ring-1 ring-slate-200 print:shadow-none print:ring-0 print:my-0">
                    <div ref={documentRef} className="p-12 print:p-12">
                        <ReportDocument 
                            report={report} 
                            sources={sources} 
                            topic={topic} 
                            criticScore={criticScore} 
                            revisionCount={revisionCount} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
