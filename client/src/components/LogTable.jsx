export const LogTable = ({ logs = [] }) => {
    const hasLogs = logs && logs.length > 0;

    return (
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-t-3xl" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10 shrink-0">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-100 tracking-tight">Context Logs</h2>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Logs referenced for your query</p>
                </div>
                {hasLogs && (
                    <span className="ml-auto bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-500/30 shadow-inner">
                        {logs.length} entries
                    </span>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto pr-3 relative z-10 space-y-3 custom-scrollbar">
                {!hasLogs ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                            <svg className="w-8 h-8 opacity-40 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-400">Waiting for a query to fetch logs.</p>
                    </div>
                ) : (
                    logs.map((log, index) => (
                        <div 
                            key={log?.id || index} 
                            className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 shadow-sm group/item relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/50 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            <pre className="text-[13px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap break-all">
                                [{log.timestamp}] [{log.level}] {log.raw_message}
                            </pre>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}