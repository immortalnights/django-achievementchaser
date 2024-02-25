import { Circle } from "@mui/icons-material"
import { Box, Stack, SvgIconProps, Typography } from "@mui/material"
import { getRelativeTime, duration, formatDateTime } from "@/dayjsUtilities"
import BorderedImage from "@/components/BorderedImage"
import CircularProgressWithLabel from "@/components/CircularProgressWithLabel"
import Link from "@/components/Link"

const PlayerGameDetails = ({
    player,
    color,
    lastPlayed,
    playtimeForever,
}: {
    player: Player
    color: SvgIconProps["color"]
    lastPlayed: string | null
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
                        title={lastPlayed ? formatDateTime(lastPlayed) : ""}
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
    player2Owner,
}: {
    gameAchievementCount: number
    player1Owner: PlayerOwnedGameWithPlayer
    player2Owner: PlayerOwnedGameWithPlayer
}) => {
    const player1 = player1Owner.player
    const player2 = player2Owner.player

    const player1AchievementCount = player1Owner.unlockedAchievementCount ?? 0
    const player2AchievementCount = player2Owner.unlockedAchievementCount ?? 0

    const player1CompletionPercentage =
        (player1AchievementCount / gameAchievementCount) * 100
    const player2CompletionPercentage =
        (player2AchievementCount / gameAchievementCount) * 100

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
            <Box display="flex" flexDirection="column" alignItems="center">
                <CircularProgressWithLabel
                    value={player1CompletionPercentage}
                />
                <Typography fontSize="small">
                    {player1AchievementCount} of {gameAchievementCount}
                </Typography>
            </Box>
            <Box flexGrow={1} />
            <Box display="flex" flexDirection="column">
                <CircularProgressWithLabel
                    value={player2CompletionPercentage}
                    color="secondary"
                />
                <Typography fontSize="small">
                    {player2AchievementCount} of {gameAchievementCount}
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
