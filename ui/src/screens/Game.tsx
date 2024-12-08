import GameHeader from "@/components/GameHeader"
import { useLoaderData } from "react-router-dom"
import GameAchievements from "@/components/GameAchievements"

const GameScreen = () => {
    const game = useLoaderData<Game | undefined>()

    if (!game) {
        throw new Error("Failed to load game")
    }

    return (
        <>
            <GameHeader game={game} />
            <GameAchievements achievements={game.achievements ?? []} />
        </>
    )
}

export default GameScreen
