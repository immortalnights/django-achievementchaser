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
            <GameAchievements achievements={game.achievements ?? []} />
        </>
    )
}

export default GameScreen
