import React from "react"
import ReactDOM from "react-dom/client"
import { CssBaseline } from "@mui/material"
import "./index.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { RouterProvider } from "react-router-dom"
import router from "./router.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <CssBaseline>
            <RouterProvider router={router} />
        </CssBaseline>
    </React.StrictMode>
)
