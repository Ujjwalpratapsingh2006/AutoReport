import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Send, Loader2, FileText } from "lucide-react";
import MessageBubble from "../components/MessageBubble";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth";

export default function ChatPage() {
    const { ticker } = useParams();
    const fetchWithAuth = useFetchWithAuth();
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [chatDetails, setChatDetails] = useState(null);
    
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Fetch Chat History on mount
    useEffect(() => {
        const fetchHistory = async () => {
            setIsPageLoading(true);
            const chatSession = await fetchWithAuth(`/api/chats/${ticker}`);
            if (chatSession && !chatSession.error && chatSession.messages) {
                setMessages(chatSession.messages);
                setChatDetails({
                    year: chatSession.filingYear,
                    url: chatSession.filingUrl,
                    type: chatSession.filingType
                });
            }
            setIsPageLoading(false);
        };
        fetchHistory();
    }, [ticker]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const question = input.trim();
        setInput("");
        
        // Optimistically add user message
        const newMessages = [...messages, { role: "user", content: question }];
        setMessages(newMessages);
        setIsLoading(true);

        // Send to backend
        const response = await fetchWithAuth("/api/ai/chat", {
            method: "POST",
            body: JSON.stringify({ question, ticker })
        });

        setIsLoading(false);

        if (response.error) {
            setMessages(prev => [...prev, { 
                role: "agent", 
                content: "⚠️ Sorry, I encountered an error processing your request: " + response.error 
            }]);
            return;
        }

        // Add Agent Response
        setMessages(prev => [...prev, {
            role: "agent",
            content: response.answer,
            agentData: {
                dataSource: response.dataSource,
                searchQuery: response.searchQuery,
            }
        }]);
    };

    if (isPageLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-950 relative">
            
            {/* Sticky Header */}
            <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                        <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                            {ticker.toUpperCase()} {chatDetails?.year ? `${chatDetails.year} ` : ''}{chatDetails?.type || 'Analysis'}
                        </h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-slate-400">Agentic RAG SEC Analyst</p>
                            {chatDetails?.url && (
                                <>
                                    <span className="text-slate-700">•</span>
                                    <a href={chatDetails.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 underline-offset-2">
                                        View Source Filing
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto w-full">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <FileText className="w-12 h-12 text-slate-700" />
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-slate-300">Start your analysis</h2>
                            <p className="text-slate-500 max-w-sm">
                                Ask a question about {ticker}'s financial performance, risk factors, or business strategy.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="pb-32">
                        {messages.map((msg, idx) => (
                            <MessageBubble key={idx} message={msg} />
                        ))}
                        
                        {isLoading && (
                            <div className="py-6 bg-slate-800/30 border-y border-slate-800/50">
                                <div className="max-w-4xl mx-auto flex gap-4 px-4 sm:px-6">
                                    <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center shadow-sm shrink-0 mt-1">
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center space-y-2">
                                        <div className="text-emerald-400 font-medium text-[15px] animate-pulse">
                                            Analyzing SEC Filings...
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Running Vector Search & Agentic Workflow
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-10 pb-6 px-4">
                <div className="max-w-4xl mx-auto relative">
                    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-900 border border-slate-700 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 rounded-2xl shadow-xl transition-all p-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder={`Ask about ${ticker}'s SEC filings...`}
                            className="w-full max-h-32 min-h-[44px] bg-transparent text-slate-100 placeholder-slate-500 p-2 ml-2 resize-none outline-none text-[15px] leading-relaxed"
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 mb-0.5 mr-0.5"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <div className="text-center mt-2 text-xs text-slate-500">
                        AI answers can contain hallucinations. Verify critical financial data against actual SEC filings.
                    </div>
                </div>
            </div>
        </div>
    );
}
