import { Paper } from "@mui/material"
import GameHeader from "../components/GameHeader"
import { useLoaderData } from "react-router-dom"
import GameAchievements from "../components/GameAchievements"

const GameScreen = () => {
    const { game } = useLoaderData() as GameQueryResponse

    return (
        <>
            <GameHeader game={game} />
            <Paper sx={{ marginTop: "1em" }} elevation={0}>
                <GameAchievements game={String(game.id)} />
            </Paper>
        </>
    )
}

export default GameScreen
