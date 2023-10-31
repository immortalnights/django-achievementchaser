import { useContext } from "react"
import GameAchievements from "../components/GameAchievements2"
import PlayerSettingsContext from "../context/PlayerSettingsContext"

const PlayerGameAchievements = ({
    achievements,
    playerAchievements,
}: {
    achievements: Achievement[]
    playerAchievements: RecentAchievement[]
}) => {
    const { achievementSortOrder, hideUnlockedAchievements } = useContext(
        PlayerSettingsContext
    )

    const playerAchievementReferenceSort = (a: Achievement, b: Achievement) => {
        const aIndex = playerAchievements.findIndex(
            (item) => item.id === a.name
        )
        const bIndex = playerAchievements.findIndex(
            (item) => item.id === b.name
        )

        return aIndex === -1 || bIndex === -1 ? 1 : aIndex - bIndex
    }

    const filterUnlockedAchievements = () => {
        return achievements.filter(
            (achievement) =>
                !playerAchievements.find(
                    (playerAchievement) =>
                        playerAchievement.id === achievement.name
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
            playerAchievements={playerAchievements}
        />
    ) : (
        <div
            style={{
                marginTop: 10,
                padding: 8,
                textAlign: "center",
                background: "lightgray",
            }}
        >
            No Achievements
        </div>
    )
}

export default PlayerGameAchievements
