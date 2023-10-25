import { useState, ChangeEvent, KeyboardEvent } from "react"
import { InputBase, alpha, styled } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useNavigate } from "react-router-dom"

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "18ch",
            "&:focus": {
                width: "24ch",
            },
        },
    },
}))

const SearchField = ({
    placeholder,
    ariaLabel,
}: {
    placeholder: string
    ariaLabel: string
}) => {
    const navigate = useNavigate()
    const [value, setValue] = useState("")

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && value) {
            const val = value
            setValue("")
            navigate(`/Search/${val}`)
        }
    }

    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                name="name"
                onChange={handleOnChange}
                value={value}
                placeholder={placeholder}
                inputProps={{ "aria-label": ariaLabel }}
                onKeyDown={handleKeyDown}
            />
        </Search>
    )
}

export default SearchField
