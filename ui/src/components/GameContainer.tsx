import {
    Paper,
    Box,
    Link as ExternalLink,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
} from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { useLoaderData, Link } from "react-router-dom"
import { OpenInNew } from "@mui/icons-material"
import BorderedImage from "./BorderedImage"
import Loader from "./Loader"
import { useQueryGameAchievements, useQueryGameOwners } from "../api/queries"
import { duration, formatDate, getRelativeTime } from "../utilities"
import CircularProgressWithLabel from "./CircularProgressWithLabel"

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

const GameHeader = ({ game }: { game: Game }) => {
    return (
        <>
            <Box sx={{ display: "flex", marginBottom: "0.25em" }}>
                <ExternalLink
                    component={Link}
                    to={`/game/${game.id}`}
                    variant="h4"
                    underline="none"
                >
                    {game.name}
                </ExternalLink>
                <Box
                    sx={{
                        display: "flex",
                        paddingX: 1,
                        alignItems: "flex-end",
                    }}
                >
                    <ExternalLink
                        href={`https://store.steampowered.com/app/${
                            game.id
                        }/${encodeURIComponent(game.name ?? "")}`}
                        title="Steam Profile"
                        rel="noopener"
                    >
                        <OpenInNew fontSize="small" />
                    </ExternalLink>
                </Box>
            </Box>
            <Grid container>
                <Grid paddingRight="1em">
                    <BorderedImage
                        src={`https://media.steampowered.com/steam/apps/${game.id}/header.jpg`}
                    />
                </Grid>
                <Grid flexGrow={1}>
                    <Box
                        display="flex"
                        gap={2}
                        borderBottom="1px solid lightgray"
                    >
                        <Box>
                            <Typography
                                variant="subtitle1"
                                textTransform="uppercase"
                            >
                                Achievements
                            </Typography>
                            <Typography variant="body1">
                                {game.achievementCount ?? "?"}
                            </Typography>
                        </Box>
                    </Box>
                    <GameOwners game={game} />
                </Grid>
            </Grid>
        </>
    )
}

const AchievementItem = ({
    displayName,
    description,
    iconUrl,
    globalPercentage,
}: Achievement) => {
    const startGradient = Math.floor(globalPercentage ?? 0)
    const endGradient = 100 - startGradient
    return (
        <li style={{ display: "flex", margin: "0.25em 0" }}>
            <img src={iconUrl} style={{ width: 64, height: 64 }} />
            <div
                style={{
                    display: "flex",
                    flexGrow: 1,
                    border: "1px solid white",
                    borderRadius: 5,
                    marginLeft: "0.5em",
                }}
            >
                <div
                    style={{
                        flexGrow: 1,
                        textAlign: "left",
                        position: "relative",
                        background: `linear-gradient(to right, #ccc ${startGradient}%, transparent ${
                            100 - endGradient
                        }%)`,
                        border: "1px solid darkgray",
                    }}
                >
                    <div style={{ padding: "0.1em 0 0.1em 0.5em" }}>
                        <Typography variant="h6">{displayName}</Typography>
                        <Typography>{description}</Typography>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        width: "4em",
                    }}
                >
                    <div style={{ margin: "auto" }}>
                        {globalPercentage?.toFixed(2)}%
                    </div>
                </div>
            </div>
        </li>
    )
}

const GameAchievements = ({ game }: { game: string }) => {
    const { loading, error, data } = useQueryGameAchievements({
        game,
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {data.map((achievement) => (
                            <AchievementItem
                                key={achievement.name}
                                {...achievement}
                            />
                        ))}
                    </ul>
                )
            }}
        />
    )
}

const GameContainer = () => {
    const { game } = useLoaderData() as GameQueryResponse

    return (
        <>
            <GameHeader game={game} />
            <Paper sx={{ marginTop: "1em" }} elevation={0}>
                <GameAchievements game={String(game.id)} />
            </Paper>
        </>
    )
}

export default GameContainer
