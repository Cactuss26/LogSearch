import { useState, useRef, useEffect } from "react"

export const QueryBox = ({ handleQuery }) => {
    const [query, setquery] = useState("");
    const textareaRef = useRef(null);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        handleQuery(e, query);
    }

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
        }
    }

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [query]);

    return (
        <div className="relative mt-4 md:mt-6 shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-60 transition duration-1000" />
            <form onSubmit={onSubmit} className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl flex items-end p-2 transition-all group">
                <textarea 
                    ref={textareaRef}
                    value={query} 
                    onChange={(e) => setquery(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Ask a question about the logs..."
                    rows={1}
                    className="w-full bg-transparent text-slate-100 placeholder-slate-400 p-4 pl-6 text-[15px] focus:outline-none resize-none max-h-40 overflow-y-auto custom-scrollbar"
                />
                <button 
                    type="submit"
                    disabled={!query.trim()}
                    className="m-2 p-3.5 rounded-2xl bg-white/10 text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:from-transparent disabled:hover:to-transparent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-sm"
                >
                    <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    )
}