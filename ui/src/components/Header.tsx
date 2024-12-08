import { AppBar, Toolbar, Typography, styled } from "@mui/material"
import { Link } from "react-router-dom"
import SearchField from "./controls/SearchField"
import { useNavigate } from "react-router-dom"

const UndecoratedLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`

const Header = () => {
    const navigate = useNavigate()

    const handleSearch = (value: string) => {
        navigate(`/Search/${value}`)
    }

    return (
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
                <SearchField
                    placeholder="Search"
                    ariaLabel="search"
                    onSubmit={handleSearch}
                    expandOnFocus
                />
            </Toolbar>
        </AppBar>
    )
}
export default Header
