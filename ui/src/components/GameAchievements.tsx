import { Box, Stack, SvgIconProps, Typography, styled } from "@mui/material"
import { formatDateTime, getRelativeTime } from "../utilities"
import { Circle } from "@mui/icons-material"
import { ReactNode, useState } from "react"

const AchievementIcon = ({
    achievement,
    unlocked,
}: {
    achievement: Achievement
    unlocked: boolean
}) => (
    <img
        src={unlocked ? achievement.iconUrl : achievement.iconGrayUrl}
        style={{ width: 64, height: 64 }}
    />
)

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

const AchievementContainerBorder = styled("div")({
    border: "1px solid darkgray",
    borderRadius: 2,
    padding: 2,
})

const AchievementContainerFill = styled("div")(
    ({
        startGradient,
        endGradient,
    }: {
        startGradient: number
        endGradient: number
    }) => ({
        flexGrow: 1,
        display: "flex",
        background: `linear-gradient(to right, #ccc ${startGradient}%, transparent ${
            100 - endGradient
        }%)`,
        minHeight: 59,
    })
)

const AchievementContainer = ({
    globalPercentage,
    children,
}: {
    globalPercentage: number
    children: ReactNode
}) => {
    const startGradient = Math.floor(globalPercentage)
    const endGradient = 100 - startGradient

    return (
        <AchievementContainerBorder>
            <AchievementContainerFill
                startGradient={startGradient}
                endGradient={endGradient}
            >
                <div
                    style={{
                        padding: "0.1em 0.5em",
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    {children}
                </div>
            </AchievementContainerFill>
        </AchievementContainerBorder>
    )
}

const AchievementDetails = ({
    achievement,
    unlockedAchievementDetails,
}: {
    achievement: Achievement
    unlockedAchievementDetails?: ReactNode
}) => {
    const {
        displayName,
        description,
        hidden: initialHidden,
        globalPercentage = 0,
    } = achievement
    const [hidden, setHidden] = useState(initialHidden)

    const handleClick = () => {
        setHidden(false)
    }

    return (
        <div
            style={{
                flexGrow: 1,
                marginLeft: "0.5em",
                marginRight: "0.5em",
            }}
        >
            <AchievementContainer globalPercentage={globalPercentage}>
                {hidden ? (
                    <Box
                        onClick={handleClick}
                        display="flex"
                        flexGrow={1}
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            cursor: "pointer",
                        }}
                    >
                        Click to reveal
                    </Box>
                ) : (
                    <Box>
                        <Typography variant="h6">{displayName}</Typography>
                        <Typography>
                            {description || <span>&nbsp;</span>}
                        </Typography>
                    </Box>
                )}
                <Box display="flex">{unlockedAchievementDetails}</Box>
            </AchievementContainer>
        </div>
    )
}

const AchievementGlobalPercentage = ({
    achievement: { globalPercentage },
}: {
    achievement: Achievement
}) => (
    <Box display="flex" width={64} margin="auto" justifyContent="center">
        {globalPercentage?.toFixed(2)}%
    </Box>
)

const Achievement = ({
    achievement,
    unlocked,
    compare,
    player1Achievement,
    player2Achievement,
}: {
    achievement: Achievement
    unlocked: boolean
    compare: boolean
    player1Achievement?: PlayerUnlockedAchievement
    player2Achievement?: PlayerUnlockedAchievement
}) => {
    let unlockedAchievementDetails
    if (compare) {
        unlockedAchievementDetails = (
            <Stack gap={1} alignItems="flex-end" justifyContent="center">
                <UnlockedAchievementDateTime
                    color="primary"
                    unlockedAchievement={player1Achievement}
                />
                <UnlockedAchievementDateTime
                    color="secondary"
                    unlockedAchievement={player2Achievement}
                />
            </Stack>
        )
    } else if (player1Achievement) {
        unlockedAchievementDetails = (
            <UnlockedAchievementRelative
                unlockedAchievement={player1Achievement}
            />
        )
    }

    return (
        <li style={{ display: "flex", margin: "0.25em 0" }}>
            <AchievementIcon achievement={achievement} unlocked={unlocked} />

            <AchievementDetails
                achievement={achievement}
                unlockedAchievementDetails={unlockedAchievementDetails}
            />

            {compare ? (
                <AchievementIcon
                    achievement={achievement}
                    unlocked={!!player2Achievement?.datetime}
                />
            ) : (
                <AchievementGlobalPercentage achievement={achievement} />
            )}
        </li>
    )
}

const GameAchievements = ({
    achievements,
    player1Achievements,
    player2Achievements,
}: {
    achievements: Achievement[]
    player1Achievements?: PlayerUnlockedAchievement[]
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
            const player1Achievement = player1Achievements?.find(
                (unlockedAchievement) =>
                    unlockedAchievement.achievement.id === achievement.id
            )

            const player2Achievement = player2Achievements?.find(
                (unlockedAchievement) =>
                    unlockedAchievement.achievement.id === achievement.id
            )

            return (
                <Achievement
                    achievement={achievement}
                    unlocked={!player1Achievements || !!player1Achievement}
                    compare={!!player2Achievements}
                    player1Achievement={player1Achievement}
                    player2Achievement={player2Achievement}
                />
            )
        })}
    </ul>
)

export default GameAchievements
