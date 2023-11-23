import { Paper } from "@mui/material"
import GameHeader from "../components/GameHeader"
import { useLoaderData } from "react-router-dom"
import GameAchievements from "../components/GameAchievements"

const GameScreen = () => {
    const game = useLoaderData() as Game

    if (!game) {
        throw "Failed to load game"
    }

    return (
        <>
            <GameHeader game={game} />
            <Paper sx={{ marginTop: "1em" }} elevation={0}>
                <GameAchievements achievements={game.achievements ?? []} />
            </Paper>
        </>
    )
}

export default GameScreen
