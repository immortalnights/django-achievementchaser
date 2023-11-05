import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { TextField, Button, Box, CircularProgress } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useLazyQueryPlayers } from "../api/queries"

const HomeScreen = () => {
    const navigate = useNavigate()
    const [player, setPlayer] = useState("")
    const { loading, data, trigger } = useLazyQueryPlayers()

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
        setPlayer(event.target.value)

    const submitPlayer = () => {
        if (player) {
            trigger(player)
        }
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        submitPlayer()
    }

    useEffect(() => {
        if (data && data.id) {
            navigate(`/Player/${data.id}`)
        }
    }, [data, navigate])

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
                        defaultValue={player}
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
