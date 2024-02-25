import { Alert } from "@mui/material"
import GameAchievements from "@/components/GameAchievements"
import GameAchievementsCompare from "../GameAchievementsCompare"
import GameAchievementsPlayer from "../GameAchievementsPlayer"

const GameAchievementsContainer = ({
    game,
    player1,
    player2,
}: {
    game: Game
    player1?: Player
    player2?: Player
}) => {
    let content

    if (game.achievements && game.achievements.length > 0) {
        const gameWithAchievements: GameWithAchievements = {
            ...game,
            achievements: game.achievements ?? [],
        }

        if (player1 && player2) {
            content = (
                <GameAchievementsCompare
                    game={gameWithAchievements}
                    player1={player1}
                    player2={player2}
                />
            )
        } else if (player1) {
            content = (
                <GameAchievementsPlayer
                    game={gameWithAchievements}
                    player1={player1}
                />
            )
        } else {
            content = (
                <GameAchievements
                    achievements={gameWithAchievements.achievements ?? []}
                />
            )
        }
    } else {
        content = (
            <Alert severity="info" sx={{ marginTop: 1 }}>
                No Achievements
            </Alert>
        )
    }
    return content
}

export default GameAchievementsContainer
