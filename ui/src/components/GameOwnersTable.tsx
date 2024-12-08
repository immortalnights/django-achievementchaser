import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
} from "@mui/material"
import { duration, formatDate, getRelativeTime } from "@/dayjsUtilities"
import BorderedImage from "./BorderedImage"
import CircularProgressWithLabel from "./CircularProgressWithLabel"
import Link from "./Link"
import { unwrapEdges } from "@/api/utils"

const OwnerRow = ({
    game,
    ownedGame,
}: {
    game: Game
    ownedGame: PlayerOwnedGame
}) => {
    const {
        player,
        lastPlayed,
        playtimeForever,
        unlockedAchievementCount = 0,
        completed,
    } = ownedGame

    const achievementCount = game.achievementCount ?? 0

    const completionPercentage =
        achievementCount > 0 ? unlockedAchievementCount / achievementCount : 0

    return (
        <TableRow>
            <TableCell>
                <Link
                    to={`/Player/${player?.id ?? ""}/Game/${game.id}`}
                    variant="subtitle1"
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            // width: 185,
                        }}
                    >
                        <BorderedImage
                            src={player?.avatarSmallUrl}
                            style={{ marginRight: 6 }}
                        />
                        <span>{player?.name}</span>
                    </Box>
                </Link>
            </TableCell>
            <TableCell align="center">
                {achievementCount > 0 && (
                    <CircularProgressWithLabel
                        value={completionPercentage * 100}
                    />
                )}
            </TableCell>
            <TableCell>
                {lastPlayed ? (
                    <div title={formatDate(lastPlayed)}>
                        {getRelativeTime(lastPlayed)}
                    </div>
                ) : (
                    "Never"
                )}
            </TableCell>
            <TableCell>
                {completed ? (
                    <div title={formatDate(completed)}>
                        {getRelativeTime(completed)}
                    </div>
                ) : (
                    "-"
                )}
            </TableCell>
            <TableCell>
                {playtimeForever && playtimeForever > 0
                    ? `${duration(playtimeForever).asHours().toFixed(1)} hours`
                    : "None"}
            </TableCell>
        </TableRow>
    )
}

const GameOwnersTable = ({ game }: { game: Game }) => {
    const owners = unwrapEdges(game.owners)

    return owners.length > 0 ? (
        <Table size="small" sx={{ width: "100%" }}>
            <TableHead>
                <TableRow>
                    <TableCell>Player</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Last Played</TableCell>
                    <TableCell>Completed</TableCell>
                    <TableCell>Play Time</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {owners.map((ownedGame) => (
                    <OwnerRow
                        key={ownedGame.player.id}
                        game={game}
                        ownedGame={ownedGame}
                    />
                ))}
            </TableBody>
        </Table>
    ) : undefined
}

export default GameOwnersTable
