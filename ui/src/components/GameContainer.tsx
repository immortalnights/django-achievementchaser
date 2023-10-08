import { Paper, Box, Link as ExternalLink, Typography } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { useLoaderData, Link } from "react-router-dom"
import { OpenInNew } from "@mui/icons-material"
import BorderedImage from "./BorderedImage"
import Loader from "./Loader"
import { useQueryGameAchievements } from "../api/queries"

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
                <Grid>
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
                    <hr />
                    {/* <PlayerCompareSelect /> */}
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
                <GameAchievements game={game.id} />
            </Paper>
        </>
    )
}

export default GameContainer
