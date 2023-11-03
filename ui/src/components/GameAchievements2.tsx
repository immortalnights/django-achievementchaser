import { Box, Typography } from "@mui/material"
import { formatDateTime, getRelativeTime } from "../utilities"

const AchievementItem = ({
    displayName,
    description,
    iconUrl,
    iconGrayUrl,
    globalPercentage,
    unlocked,
}: MaybeUnlockedAchievement) => {
    const startGradient = Math.floor(globalPercentage ?? 0)
    const endGradient = 100 - startGradient

    return (
        <li style={{ display: "flex", margin: "0.25em 0" }}>
            <img
                src={unlocked ? iconUrl : iconGrayUrl}
                style={{ width: 64, height: 64 }}
            />
            <div
                style={{
                    flexGrow: 1,
                    marginLeft: "0.5em",
                }}
            >
                <div
                    style={{
                        border: "1px solid darkgray",
                        borderRadius: 2,
                        padding: 2,
                    }}
                >
                    <div
                        style={{
                            flexGrow: 1,
                            display: "flex",
                            background: `linear-gradient(to right, #ccc ${startGradient}%, transparent ${
                                100 - endGradient
                            }%)`,
                        }}
                    >
                        <div
                            style={{
                                padding: "0.1em 0 0.1em 0.5em",
                                flexGrow: 1,
                            }}
                        >
                            <Typography variant="h6">{displayName}</Typography>
                            <Typography>
                                {description || <span>&nbsp;</span>}
                            </Typography>
                        </div>
                        {unlocked && (
                            <Box
                                sx={{ margin: "auto 0.5em", minWidth: "10em" }}
                            >
                                <Typography>{`Unlocked ${getRelativeTime(
                                    unlocked
                                )}`}</Typography>
                                <Typography fontSize="small">
                                    {formatDateTime(unlocked)}
                                </Typography>
                            </Box>
                        )}
                    </div>
                </div>
            </div>
            <div
                style={{
                    margin: "auto 0.5em",
                    minWidth: 60,
                    textAlign: "center",
                }}
            >
                {globalPercentage?.toFixed(2)}%
            </div>
        </li>
    )
}

const GameAchievements = ({
    achievements,
    playerAchievements,
}: {
    achievements: Achievement[]
    playerAchievements: RecentAchievement[]
}) => (
    <ul
        style={{
            listStyle: "none",
            padding: "0 0 2em",
            margin: "0.75em 0 0",
        }}
    >
        {achievements.map((achievement) => {
            const playerAchievement = playerAchievements.find(
                (value) => value.id === achievement.id
            )

            return (
                <AchievementItem
                    key={achievement.name}
                    {...achievement}
                    unlocked={playerAchievement?.unlocked}
                />
            )
        })}
    </ul>
)

export default GameAchievements
