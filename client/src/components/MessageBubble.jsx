import ReactMarkdown from 'react-markdown';
import { Bot, User, Globe, FileText, AlertCircle } from 'lucide-react';

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const data = message.agentData;

    return (
        <div className={`py-6 ${isUser ? 'bg-transparent' : 'bg-slate-800/30 border-y border-slate-800/50'}`}>
            <div className="max-w-4xl mx-auto flex gap-4 px-4 sm:px-6">
                
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                    {isUser ? (
                        <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center shadow-sm">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-4 min-w-0">
                    {/* The Markdown Message */}
                    <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-[15px] leading-relaxed">
                        {isUser ? (
                            <p className="whitespace-pre-wrap m-0 font-medium">{message.content}</p>
                        ) : (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        )}
                    </div>

                    {/* Agent Metadata Badges (Only show for AI) */}
                    {!isUser && data && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            
                            {/* Data Source Badge */}
                            {data.dataSource === 'vector_store' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <FileText className="w-3 h-3" />
                                    SEC Filing
                                </span>
                            )}
                            {data.dataSource === 'web' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    <Globe className="w-3 h-3" />
                                    Web Search
                                </span>
                            )}
                            {data.dataSource === 'web_search_failed' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    <AlertCircle className="w-3 h-3" />
                                    No Sources Found
                                </span>
                            )}

                            {/* Rewritten Query Badge */}
                            {data.searchQuery && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                    <span className="opacity-70">Searched:</span> {data.searchQuery}
                                </span>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
