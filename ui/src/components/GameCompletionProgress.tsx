import { Typography } from "@mui/material"
import CircularProgressWithLabel from "./CircularProgressWithLabel"

export const GameCompletionProgress = ({
    player,
    achievements,
    playerAchievements,
}: {
    player: Player
    achievements: number
    playerAchievements: number
}) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {playerAchievements > 0 && (
            <div style={{ margin: "8px 0 0" }}>
                <CircularProgressWithLabel
                    value={(playerAchievements / achievements) * 100}
                />
            </div>
        )}
        <div>
            <Typography variant="subtitle1" textTransform="uppercase">
                {player.name}
            </Typography>
            <div>
                {playerAchievements} of {achievements}
            </div>
        </div>
    </div>
)
