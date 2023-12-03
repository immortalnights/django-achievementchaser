import { useContext } from "react"
import GameAchievements from "./GameAchievements"
import PlayerSettingsContext from "@/context/PlayerSettingsContext"
import { Alert } from "@mui/material"

const PlayerGameAchievements = ({
    achievements,
    player1Achievements,
    player2Achievements,
}: {
    achievements: Achievement[]
    player1Achievements: PlayerUnlockedAchievement[]
    player2Achievements?: PlayerUnlockedAchievement[]
}) => {
    const { achievementSortOrder, hideUnlockedAchievements } = useContext(
        PlayerSettingsContext
    )

    const playerAchievementReferenceSort = (a: Achievement, b: Achievement) => {
        const aIndex = player1Achievements.findIndex(
            (item) => item.achievement.id === a.id
        )
        const bIndex = player1Achievements.findIndex(
            (item) => item.achievement.id === b.id
        )

        return aIndex === -1 || bIndex === -1 ? 1 : aIndex - bIndex
    }

    const filterUnlockedAchievements = () => {
        return achievements.filter(
            (achievement) =>
                !player1Achievements.find(
                    (playerAchievement) =>
                        playerAchievement.achievement.id === achievement.id
                )
        )
    }

    let mutatedAchievements
    if (hideUnlockedAchievements) {
        mutatedAchievements = filterUnlockedAchievements()
    } else if (achievementSortOrder === "unlocked") {
        // Array is modified in place
        mutatedAchievements = achievements
            .slice()
            .sort(playerAchievementReferenceSort)
    } else {
        mutatedAchievements = achievements
    }

    return achievements.length > 0 ? (
        <GameAchievements
            achievements={mutatedAchievements}
            player1Achievements={player1Achievements}
            player2Achievements={player2Achievements}
        />
    ) : (
        <Alert severity="info">No Achievements</Alert>
    )
}

export default PlayerGameAchievements
