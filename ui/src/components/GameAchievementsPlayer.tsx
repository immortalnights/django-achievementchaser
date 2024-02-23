import { useAchievementFilter, useLoadPlayerAchievements } from "@/api/utils"
import GameAchievements from "./GameAchievements"
import { Alert } from "@mui/material"

const GameAchievementsPlayer = ({
    game,
    player1,
}: {
    game: GameWithAchievements
    player1?: Player
}) => {
    const player1Achievements = useLoadPlayerAchievements({
        player: player1?.id ?? "",
        game: Number(game.id),
        orderBy: "-datetime",
    })

    const mutatedAchievements = useAchievementFilter(
        game.achievements,
        player1Achievements ?? []
    )

    let content
    if (mutatedAchievements.length === 0) {
        content = (
            <Alert variant="outlined" severity="success" sx={{ marginTop: 1 }}>
                All achievements have been completed
            </Alert>
        )
    } else {
        content = (
            <GameAchievements
                achievements={mutatedAchievements}
                player1Achievements={player1Achievements}
            />
        )
    }
    return content
}

export default GameAchievementsPlayer
