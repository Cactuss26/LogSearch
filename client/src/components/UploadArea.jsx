import { useState } from "react"

export const UploadArea = () => {
    const [loading, setloading] = useState(false);
    const [selectedFile, setselectedFile] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"
    const handleFileUpload = (e) => {
        setselectedFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            // show error
            return;
        }
        
        setloading(true);
        const formData = new FormData();
        formData.append("logfile", selectedFile);

        try {
            // file accept endpoint not created yet
            const response = await fetch(BACKEND_URL + "", { method: "POST", body: formData });
    
            if (!response.ok) {
                // show error
                return;
            }

            // navigate to chat area (routing incomplete so will add later)
        }
        catch(error) {
            console.error("Internal Server Error:", error);
        }
        
        finally {
            setloading(false);
        }
    }
    return (
        // styling will be done by AI, based on the design I will give
        <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileUpload} accept=".log,.txt" disabled={loading}/>
                <button type="submit" disabled={loading}>Upload</button>
        </form>
    )
}