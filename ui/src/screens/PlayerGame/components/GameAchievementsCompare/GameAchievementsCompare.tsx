import { useLoadPlayerAchievements, useAchievementFilter } from "@/api/utils"
import GameAchievements from "@/components/GameAchievements"

const GameAchievementsCompare = ({
    game,
    player1,
    player2,
}: {
    game: GameWithAchievements
    player1?: Player
    player2?: Player
}) => {
    const player1Achievements = useLoadPlayerAchievements({
        player: player1?.id ?? "",
        game: Number(game.id),
        orderBy: "-datetime",
    })

    const player2Achievements = useLoadPlayerAchievements({
        player: player2?.id ?? "",
        game: Number(game.id),
        orderBy: "-datetime",
    })

    const mutatedAchievements = useAchievementFilter(
        game.achievements,
        player1Achievements
    )

    return (
        <GameAchievements
            achievements={mutatedAchievements}
            player1Achievements={player1Achievements}
            player2Achievements={player2Achievements}
        />
    )
}

export default GameAchievementsCompare
