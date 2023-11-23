import {
    Box,
    Stack,
    SvgIconProps,
    Typography,
    TypographyProps,
} from "@mui/material"
import { formatDateTime, getRelativeTime } from "../utilities"
import { playerUnlockedAchievements } from "../api/documents"
import { Circle } from "@mui/icons-material"
import { DefaultComponentProps } from "@mui/material/OverridableComponent"
import { ReactNode } from "react"

const AchievementIcon = ({
    achievement,
    playerAchievement,
}: {
    achievement: Achievement
    playerAchievement?: PlayerUnlockedAchievement
}) => {
    const unlocked = playerAchievement && playerAchievement.datetime

    return (
        <img
            src={unlocked ? achievement.iconUrl : achievement.iconGrayUrl}
            style={{ width: 64, height: 64 }}
        />
    )
}

const UnlockedAchievementRelative = ({
    unlockedAchievement,
}: {
    unlockedAchievement: PlayerUnlockedAchievement
}) => {
    return (
        <Box sx={{ margin: "auto 0.5em", minWidth: "10em" }}>
            <Typography>{`Unlocked ${getRelativeTime(
                unlockedAchievement.datetime
            )}`}</Typography>
            <Typography fontSize="small">
                {formatDateTime(unlockedAchievement.datetime)}
            </Typography>
        </Box>
    )
}

const UnlockedAchievementDateTime = ({
    color,
    unlockedAchievement,
}: {
    color: SvgIconProps["color"]
    unlockedAchievement?: PlayerUnlockedAchievement
}) => {
    return (
        unlockedAchievement && (
            <Stack direction="row" alignItems="center" gap={0.5}>
                <Circle color={color} fontSize="small" />
                <Typography fontSize="small">
                    {formatDateTime(unlockedAchievement.datetime)}
                </Typography>
            </Stack>
        )
    )
}

const AchievementDetails = ({
    achievement,
    unlockedAchievementDetails,
}: {
    achievement: Achievement
    unlockedAchievementDetails?: ReactNode
}) => {
    const { displayName, description, globalPercentage } = achievement
    const startGradient = Math.floor(globalPercentage ?? 0)
    const endGradient = 100 - startGradient

    return (
        <div
            style={{
                flexGrow: 1,
                marginLeft: "0.5em",
                marginRight: "0.5em",
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
                            padding: "0.1em 0.5em",
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box>
                            <Typography variant="h6">{displayName}</Typography>
                            <Typography>
                                {description || <span>&nbsp;</span>}
                            </Typography>
                        </Box>
                        {unlockedAchievementDetails}
                    </div>
                </div>
            </div>
        </div>
    )
}

const UnlockedAchievementDetails = ({
    compare,
    player1,
    player2,
}: {
    compare?: boolean
    player1?: PlayerUnlockedAchievement
    player2?: PlayerUnlockedAchievement
}) => {
    return (
        <Box display="flex">
            {!compare ? (
                player1 && (
                    <UnlockedAchievementRelative
                        unlockedAchievement={player1}
                    />
                )
            ) : (
                <Stack gap={1} alignItems="flex-end" justifyContent="center">
                    <UnlockedAchievementDateTime
                        color="primary"
                        unlockedAchievement={player1}
                    />
                    <UnlockedAchievementDateTime
                        color="secondary"
                        unlockedAchievement={player2}
                    />
                </Stack>
            )}
        </Box>
    )
}

const AchievementItem = ({
    achievement,
    unlockedAchievementDetails,
    player1Achievement,
}: {
    achievement: Achievement
    unlockedAchievementDetails?: ReactNode
    player1Achievement?: PlayerUnlockedAchievement
}) => {
    return (
        <li style={{ display: "flex", margin: "0.25em 0" }}>
            <AchievementIcon
                achievement={achievement}
                playerAchievement={player1Achievement}
            />
            <AchievementDetails
                achievement={achievement}
                unlockedAchievementDetails={unlockedAchievementDetails}
            />
            <div
                style={{
                    display: "flex",
                    width: 64,
                    margin: "auto",
                    justifyContent: "center",
                }}
            >
                {achievement.globalPercentage?.toFixed(2)}%
            </div>
        </li>
    )
}

const AchievementItemCompare = ({
    achievement,
    player1Achievement,
    player2Achievement,
}: {
    achievement: Achievement
    player1Achievement?: PlayerUnlockedAchievement
    player2Achievement?: PlayerUnlockedAchievement
}) => {
    const unlockedAchievementDetails = (
        <UnlockedAchievementDetails
            compare={true}
            player1={player1Achievement}
            player2={player2Achievement}
        />
    )

    return (
        <li style={{ display: "flex", margin: "0.25em 0" }}>
            <AchievementIcon
                achievement={achievement}
                playerAchievement={player1Achievement}
            />
            <AchievementDetails
                achievement={achievement}
                unlockedAchievementDetails={unlockedAchievementDetails}
            />
            <AchievementIcon
                achievement={achievement}
                playerAchievement={player2Achievement}
            />
        </li>
    )
}

const GameAchievements = ({
    achievements,
    player1Achievements,
    player2Achievements,
}: {
    achievements: Achievement[]
    player1Achievements: PlayerUnlockedAchievement[]
    player2Achievements?: PlayerUnlockedAchievement[]
}) => (
    <ul
        style={{
            listStyle: "none",
            padding: "0 0 2em",
            margin: "0.75em 0 0",
        }}
    >
        {achievements.map((achievement) => {
            const player1Achievement = player1Achievements.find(
                (unlockedAchievement) =>
                    unlockedAchievement.achievement.id === achievement.id
            )
            const player2Achievement = player2Achievements
                ? player2Achievements.find(
                      (unlockedAchievement) =>
                          unlockedAchievement.achievement.id === achievement.id
                  )
                : undefined

            return player2Achievements ? (
                <AchievementItemCompare
                    key={achievement.id}
                    achievement={achievement}
                    player1Achievement={player1Achievement}
                    player2Achievement={player2Achievement}
                />
            ) : (
                <AchievementItem
                    key={achievement.id}
                    achievement={achievement}
                    player1Achievement={player1Achievement}
                />
            )
        })}
    </ul>
)

export default GameAchievements
