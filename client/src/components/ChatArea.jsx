import { useOutletContext } from "react-router"
import { LogTable } from "./LogTable"
import { QueryBox } from "./QueryBox"
import { ResponseBox } from "./ResponseBox"

export const ChatArea = () => {
    const { modelRes, handleQuery, logs } = useOutletContext();
    return (
        <div>
        <LogTable logs={logs}/>
        <QueryBox handleQuery={handleQuery}/>
        <ResponseBox modelRes={modelRes}/>
        </div>
    )
}