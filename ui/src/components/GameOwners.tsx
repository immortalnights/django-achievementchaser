import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
} from "@mui/material"
import { useQueryGameOwners } from "../api/queries"
import Loader from "./Loader"
import { duration, formatDate, getRelativeTime } from "../utilities"
import BorderedImage from "./BorderedImage"
import CircularProgressWithLabel from "./CircularProgressWithLabel"
import Link from "./Link"

const GameOwnerInformation = ({
    player,
    game,
    lastPlayed,
    playtimeForever,
    completionPercentage,
    completed,
}: GameOwnerInformation) => {
    return (
        <TableRow>
            <TableCell>
                <Link to={`/Player/${player.id}/Game/${game.id}`}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            // width: 185,
                        }}
                    >
                        <BorderedImage
                            src={player.avatarSmallUrl}
                            style={{ marginRight: 6 }}
                        />
                        <span>{player.name}</span>
                    </Box>
                </Link>
            </TableCell>
            <TableCell align="center">
                {game.achievementCount > 0 && (
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
                {playtimeForever > 0
                    ? `${duration(playtimeForever).asHours().toFixed(1)} hours`
                    : "None"}
            </TableCell>
        </TableRow>
    )
}

const GameOwners = ({ game }: { game: Game }) => {
    const { loading, error, data } = useQueryGameOwners({
        game: String(game.id),
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <Table size="small" sx={{ width: "100%" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Player</TableCell>
                                <TableCell>Progress</TableCell>
                                <TableCell>Last Played</TableCell>
                                <TableCell>Completed</TableCell>
                                <TableCell>Playtime</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((information) => (
                                <GameOwnerInformation
                                    key={information.player.id}
                                    {...information}
                                />
                            ))}
                        </TableBody>
                    </Table>
                )
            }}
        />
    )
}

export default GameOwners
