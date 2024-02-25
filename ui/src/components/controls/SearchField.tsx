import { useState, ChangeEvent, KeyboardEvent } from "react"
import { InputBase, alpha, styled } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"

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
            width: "20ch",
        },
    },
}))

const ExandableInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "8ch",
            "&:focus": {
                width: "22ch",
            },
        },
    },
}))

const SearchField = ({
    placeholder,
    ariaLabel,
    value: defaultValue,
    onSubmit,
    submitOnEnter = true,
    expandOnFocus = false,
}: {
    placeholder: string
    ariaLabel: string
    value?: string
    onSubmit: (value: string) => void
    submitOnEnter?: boolean
    expandOnFocus?: boolean
}) => {
    const [value, setValue] = useState<string>(defaultValue ?? "")

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value
        setValue(val)
        if (!submitOnEnter) {
            onSubmit(val)
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (submitOnEnter && event.key === "Enter" && value) {
            setValue("")
            onSubmit(value)
        }
    }

    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            {expandOnFocus ? (
                <ExandableInputBase
                    name="name"
                    onChange={handleOnChange}
                    value={value}
                    placeholder={placeholder}
                    inputProps={{ "aria-label": ariaLabel }}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <StyledInputBase
                    name="name"
                    onChange={handleOnChange}
                    value={value}
                    placeholder={placeholder}
                    inputProps={{ "aria-label": ariaLabel }}
                    onKeyDown={handleKeyDown}
                />
            )}
        </Search>
    )
}

export default SearchField
