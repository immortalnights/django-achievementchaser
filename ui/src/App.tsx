import { Container } from "@mui/material"
import { Outlet } from "react-router-dom"
import Header from "./components/Header"

function App() {
    return (
        <>
            <Header />
            <Container className="light" disableGutters>
                <Outlet />
            </Container>
        </>
    )
}

export default App
