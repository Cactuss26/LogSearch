import { useState } from 'react';
import { Outlet } from 'react-router';

function App() {
    const [modelRes, setmodelRes] = useState("");
    const [logs, setlogs] = useState([]);
    const [sessionId, setsessionId] = useState("")

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
    const handleQuery = async (e, query) => {
        e.preventDefault();
        setmodelRes("");
        setlogs([]);
        
        let fetchedLogs = [];

        // get logs
        try {
            const response = await fetch(BACKEND_URL + "/api/search", {
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
            const response = await fetch(BACKEND_URL + "/api/generate", {
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

    const setSessionId = (id) => {
        setsessionId(id);
    }

    const context = {
        modelRes,
        handleQuery,
        logs,
        setSessionId,
    }

    return (
        <Outlet context={context}/>
    )
}

export default App
