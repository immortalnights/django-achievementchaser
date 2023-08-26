import { AppBar, Toolbar, Typography, Container, styled } from "@mui/material"
import { Link, Outlet } from "react-router-dom"
import SearchField from "./components/MUISearch"

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`

function App() {
    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography
                        component={StyledLink}
                        to="/"
                        variant="h2"
                        sx={{ flexGrow: 1 }}
                    >
                        Achievement Chaser
                    </Typography>
                    <SearchField placeholder="Search" ariaLabel="search" />
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </>
    )
}

export default App
