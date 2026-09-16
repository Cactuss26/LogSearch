import { createBrowserRouter } from "react-router"
import App from "./App.jsx"
import { UploadArea } from "./components/UploadArea.jsx"
import { Layout } from "./layout/Layout.jsx"
import { ChatArea } from "./components/ChatArea.jsx"
import { FrontPage } from "./components/FrontPage.jsx"

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {  
                Component: Layout,
                children: [
                    { index: true, Component: FrontPage},
                    { path: "upload", Component: UploadArea},
                    { path: ":session_id", Component: ChatArea}
                ]
            }
            
        ]
    }
])