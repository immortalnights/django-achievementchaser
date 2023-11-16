import { ChangeEvent, FormEvent, useState } from "react"
import { TextField, Button, Box, CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useManualQuery } from "graphql-hooks"
import { searchPlayers } from "../api/documents"

const HomeScreen = () => {
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState("")
    const [query, { loading }] =
        useManualQuery<PlayerQueryResponse>(searchPlayers)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
        setInputValue(event.target.value)

    const submitPlayer = async () => {
        if (inputValue) {
            const { data } = await query({ variables: { name: inputValue } })
            if (data?.player?.id) {
                navigate(`/Player/${data.player.id}`)
            }
        }
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        submitPlayer().catch(() => console.error("Submission failed"))
    }

    return (
        <Box sx={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
            <form onSubmit={handleSubmit}>
                <Box sx={{ margin: "auto", display: "flex" }}>
                    <TextField
                        name="player"
                        label="Player name"
                        variant={"filled"}
                        size="small"
                        sx={{ width: "80%" }}
                        defaultValue={inputValue}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <Box sx={{ m: 1, position: "relative" }}>
                        <Button type="submit" disabled={loading}>
                            View
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    marginTop: "-12px",
                                    marginLeft: "-12px",
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </form>
        </Box>
    )
}

export default HomeScreen
