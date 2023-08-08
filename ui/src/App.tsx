import { AppBar, Toolbar, Typography, Container } from "@mui/material"
import { RouterProvider } from "react-router-dom"
import router from "./router"
import SearchField from "./components/MUISearch"

function App() {
    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h2" sx={{ flexGrow: 1 }}>
                        Achievement Chaser
                    </Typography>
                    <SearchField placeholder="Search" ariaLabel="search" />
                </Toolbar>
            </AppBar>
            <Container>
                <RouterProvider router={router} />
            </Container>
        </>
    )
}

export default App
