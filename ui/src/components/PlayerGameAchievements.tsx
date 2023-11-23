import { useContext } from "react"
import GameAchievements from "../components/GameAchievements2"
import PlayerSettingsContext from "../context/PlayerSettingsContext"

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
