import { Circle } from "@mui/icons-material"
import { Box, Stack, SvgIconProps, Typography } from "@mui/material"
import { getRelativeTime, duration, formatDateTime } from "../utilities"
import BorderedImage from "./BorderedImage"
import CircularProgressWithLabel from "./CircularProgressWithLabel"

const PlayerGameDetails = ({
    name,
    color,
    lastPlayed,
    playtimeForever,
}: {
    name: string
    color: SvgIconProps["color"]
    lastPlayed?: string
    playtimeForever?: number
}) => {
    const playtime = playtimeForever
        ? duration(playtimeForever).asHours().toFixed(1)
        : undefined

    return (
        <Box minWidth="120px">
            <Stack direction="row">
                <Circle color={color} />
                <Typography variant="subtitle1">{name}</Typography>
            </Stack>

            {lastPlayed || playtime ? (
                <>
                    <Typography
                        fontSize={12}
                        title={lastPlayed && formatDateTime(lastPlayed)}
                    >
                        {lastPlayed
                            ? `Last played ${getRelativeTime(lastPlayed)}`
                            : "Never played"}
                    </Typography>

                    <Typography
                        fontSize={12}
                        title={`${playtimeForever ?? 0} minutes`}
                    >
                        {playtime ? `Total playtime ${playtime} hours` : ""}
                    </Typography>
                </>
            ) : (
                <Typography fontSize={12} textAlign="center">
                    Never played
                </Typography>
            )}
        </Box>
    )
}

const PlayerGameCompareHeader = ({
    gameAchievementCount,
    player1Owner,
    player1Achievements,
    player2Owner,
    player2Achievements,
}: {
    gameAchievementCount: number
    player1Owner: PlayerOwnedGame
    player1Achievements: number
    player2Owner: PlayerOwnedGame
    player2Achievements: number
}) => {
    const player1 = player1Owner.player!
    const player2 = player2Owner.player!

    const player1CompletionPercentage =
        (player1Achievements / gameAchievementCount) * 100
    const player2CompletionPercentage =
        (player2Achievements / gameAchievementCount) * 100

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            marginTop={2}
            gap={1}
        >
            <BorderedImage src={player1.avatarMediumUrl} width={64} />
            <PlayerGameDetails
                name={player1.name!}
                color="primary"
                lastPlayed={player1Owner.lastPlayed}
                playtimeForever={player1Owner.playtimeForever}
            />
            <Box display="flex">
                <CircularProgressWithLabel
                    value={player1CompletionPercentage}
                />
            </Box>
            <Box flexGrow={1} />
            <Box display="flex">
                <CircularProgressWithLabel
                    value={player2CompletionPercentage}
                    color="secondary"
                />
            </Box>
            <PlayerGameDetails
                name={player2.name!}
                color="secondary"
                lastPlayed={player2Owner.lastPlayed}
                playtimeForever={player2Owner.playtimeForever}
            />
            <BorderedImage src={player2.avatarMediumUrl} width={64} />
        </Box>
    )
}

export default PlayerGameCompareHeader
