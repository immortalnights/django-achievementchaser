import CircularProgressWithLabel from "./CircularProgressWithLabel"

export const GameCompletionProgress = ({
    achievements,
    playerAchievements,
}: {
    achievements: number
    playerAchievements: number
}) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {playerAchievements > 0 && (
            <CircularProgressWithLabel
                value={(playerAchievements / achievements) * 100}
            />
        )}
        <div>
            <div>
                {playerAchievements} of {achievements}
            </div>
        </div>
    </div>
)
