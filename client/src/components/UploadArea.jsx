import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router";

export const UploadArea = () => {
    const [loading, setloading] = useState(false);
    const [selectedFile, setselectedFile] = useState(null);
    const { setSessionId } = useOutletContext();
    const navigate = useNavigate();

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
    const handleFileUpload = (e) => {
        setselectedFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            console.log("file not selected")
            return;
        }
        
        setloading(true);
        const formData = new FormData();
        formData.append("logfile", selectedFile);

        try {
            const response = await fetch(BACKEND_URL + "/api/store", { method: "POST", body: formData });
    
            if (!response.ok) {
                console.log("an error occured")
                return;
            }
            
            const { session_id, lines } = await response.json();
            console.log(lines, " lines analyzed");

            setSessionId(session_id);
            navigate(`/${session_id}`)

        }
        catch(error) {
            console.error("Internal Server Error:", error);
        }
        
        finally {
            setloading(false);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileUpload} accept=".log,.txt" disabled={loading}/>
                <button type="submit" disabled={loading}>Upload</button>
        </form>
    )
}