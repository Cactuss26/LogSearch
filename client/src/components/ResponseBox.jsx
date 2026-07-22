import ReactMarkdown from 'react-markdown'

export const ResponseBox = ({ modelRes }) => {
    return (
        <div className="flex-1 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/10 shrink-0">
                <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100 tracking-tight">AI Analysis</h2>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Generated response based on context</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-3 text-slate-200 leading-relaxed font-sans custom-scrollbar">
                {!modelRes ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-5">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                            <div className="w-20 h-20 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center relative z-10 shadow-lg">
                                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-[15px] font-medium text-center text-slate-400">Ask a question to generate insights.</p>
                    </div>
                ) : (
                    <div className="text-[15px] leading-7 md:leading-8 font-medium text-slate-300 pb-4 prose prose-invert max-w-none">
                        <ReactMarkdown
                            components={{
                                code({node, inline, className, children, ...props}) {
                                    return (
                                        <code className="bg-slate-800/80 text-purple-300 px-1.5 py-0.5 rounded-md font-mono text-[13px] border border-slate-700/50" {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {modelRes}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    )
}