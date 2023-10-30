import GameAchievements from "../components/GameAchievements2"

const PlayerGameAchievements = ({
    achievements,
    playerAchievements,
}: {
    achievements: Achievement[]
    playerAchievements: RecentAchievement[]
}) => {
    return achievements.length > 0 ? (
        <GameAchievements
            achievements={achievements}
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
