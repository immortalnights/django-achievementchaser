import { Paper } from "@mui/material"
import GameHeader from "../components/GameHeader"
import { useLoaderData } from "react-router-dom"
import GameAchievements from "../components/GameAchievements"

const GameScreen = () => {
    const { game, errors } = useLoaderData() as GameQueryResponse

    if (!game || (errors && errors.length > 0)) {
        throw "Failed to load game"
    }

    return (
        <>
            <GameHeader game={game} />
            <Paper sx={{ marginTop: "1em" }} elevation={0}>
                <GameAchievements game={game} />
            </Paper>
        </>
    )
}

export default GameScreen
