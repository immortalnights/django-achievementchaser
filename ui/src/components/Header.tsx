import { AppBar, Toolbar, Typography, styled } from "@mui/material"
import { Link } from "react-router-dom"
import SearchField from "./MUISearch"

const UndecoratedLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`

const Header = () => (
    <AppBar position="sticky">
        <Toolbar>
            <Typography
                component={UndecoratedLink}
                to="/"
                variant="h2"
                sx={{ flexGrow: 1 }}
            >
                Achievement Chaser
            </Typography>
            <SearchField placeholder="Search" ariaLabel="search" />
        </Toolbar>
    </AppBar>
)

export default Header
