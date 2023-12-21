import { Circle } from "@mui/icons-material"
import { Box, Stack, SvgIconProps, Typography } from "@mui/material"
import { getRelativeTime, duration, formatDateTime } from "@/dayjsUtilities"
import BorderedImage from "./BorderedImage"
import CircularProgressWithLabel from "./CircularProgressWithLabel"
import Link from "./Link"

const PlayerGameDetails = ({
    player,

    color,
    lastPlayed,
    playtimeForever,
}: {
    player: Player
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
                <Link to={`/Player/${player.id}`}>
                    <Typography variant="subtitle1">{player.name}</Typography>
                </Link>
            </Stack>

            {lastPlayed || playtime ? (
                <>
                    <Typography
                        fontSize={12}
                        title={lastPlayed && formatDateTime(lastPlayed)}
                    >
                        {lastPlayed
                            ? `Last played ${getRelativeTime(lastPlayed)}`
                            : ""}
                    </Typography>

                    <Typography
                        fontSize={12}
                        title={`${playtimeForever ?? 0} minutes`}
                    >
                        {playtime ? `Play time ${playtime} hours` : ""}
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
                player={player1}
                color="primary"
                lastPlayed={player1Owner.lastPlayed}
                playtimeForever={player1Owner.playtimeForever}
            />
            <Box display="flex" flexDirection="column">
                <CircularProgressWithLabel
                    value={player1CompletionPercentage}
                />
                <Typography fontSize="small">
                    {player1Achievements} of {gameAchievementCount}
                </Typography>
            </Box>
            <Box flexGrow={1} />
            <Box display="flex" flexDirection="column">
                <CircularProgressWithLabel
                    value={player2CompletionPercentage}
                    color="secondary"
                />
                <Typography fontSize="small">
                    {player2Achievements} of {gameAchievementCount}
                </Typography>
            </Box>
            <PlayerGameDetails
                player={player2}
                color="secondary"
                lastPlayed={player2Owner.lastPlayed}
                playtimeForever={player2Owner.playtimeForever}
            />
            <BorderedImage src={player2.avatarMediumUrl} width={64} />
        </Box>
    )
}

export default PlayerGameCompareHeader
