import { useState } from 'react';
import { LogTable } from "./components/LogTable";
import { QueryBox } from './components/QueryBox';
import { ResponseBox } from './components/ResponseBox';

function App() {
    const [modelRes, setmodelRes] = useState("");
    const [logs, setlogs] = useState([]);

    const handleQuery = async (e, query) => {
        e.preventDefault();
        setmodelRes("");
        setlogs([]);
        
        let fetchedLogs = [];

        // get logs
        try {
            const response = await fetch("http://localhost:8000/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query })
            });

            fetchedLogs = await response.json();
            setlogs(fetchedLogs);
        }

        catch (error) {
            console.error("Failed to fetch logs: ", error);
        }

        try {
            const response = await fetch("http://localhost:8000/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query, "context_logs": fetchedLogs })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let isDone = false;

            while (!isDone) {
                const { value, done } = await reader.read();
                isDone = done;

                if (value) {
                    const decodedChunk = decoder.decode(value, { stream: true });
                    
                    setmodelRes(prev => prev + decodedChunk);
                }
            }
        }

        catch (error) {
            console.error("Response generation failed: ", error);
        }
    }

    return (
        <div className="h-screen overflow-hidden p-4 md:p-8 flex flex-col">
            <header className="mb-6 md:mb-8 shrink-0">
                <div className="max-w-[1600px] mx-auto flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-white/10">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            LogSearch AI
                        </h1>
                        <p className="text-sm text-slate-400 font-medium mt-1">Intelligent Log Analysis & Querying</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 min-h-0 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="h-full overflow-hidden flex flex-col min-h-0">
                    <LogTable logs={logs}/>
                </div>

                <div className="h-full flex flex-col overflow-hidden min-h-0">
                    <ResponseBox modelRes={modelRes}/>
                    <QueryBox handleQuery={handleQuery}/>
                </div>
            </main>
        </div>
    )
}

export default App
