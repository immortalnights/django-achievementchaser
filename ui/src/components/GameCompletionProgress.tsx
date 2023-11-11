import { Typography } from "@mui/material"
import CircularProgressWithLabel from "./CircularProgressWithLabel"

export const GameCompletionProgress = ({
    achievements,
    playerAchievements,
}: {
    achievements: Achievement[]
    playerAchievements: PlayerUnlockedAchievement[]
}) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {playerAchievements.length > 0 && (
            <div style={{ margin: "8px 0 0" }}>
                <CircularProgressWithLabel
                    value={
                        (playerAchievements.length / achievements.length) * 100
                    }
                />
            </div>
        )}
        <div>
            <Typography variant="subtitle1" textTransform="uppercase">
                Achievements
            </Typography>
            <div>
                {playerAchievements.length} of {achievements.length}
            </div>
        </div>
    </div>
)
