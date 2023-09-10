import { Link, useParams } from "react-router-dom"
import { useQueryPlayer, useQueryPlayerOwnedGames } from "../api/queries"
import Loader from "../components/Loader"
import OwnedGameList from "../components/OwnedGameList"
import { throwExpression } from "../utilities"
import { Paper, Typography } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import BorderedImage from "../components/BorderedImage"

const PlayerHeaderContent = ({ player }: { player: Player }) => {
    return (
        <>
            <Link to={`/player/${player.id}`}>
                <Typography variant="h4">{player.name}</Typography>
            </Link>
            <Grid container>
                <Grid
                    xs={12}
                    sm={2}
                    display={{ xs: "none", sm: "none", md: "block" }}
                    paddingRight="1em"
                >
                    <BorderedImage
                        src={player.avatarLargeUrl}
                        style={{
                            width: "100%",
                            maxWidth: "184px",
                            margin: "auto",
                        }}
                    />
                </Grid>
                <Grid />
            </Grid>
        </>
    )
}

const PlayerHeader = ({ player }: { player: string }) => {
    const { loading, error, data } = useQueryPlayer(player)

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return <PlayerHeaderContent player={data} />
            }}
        />
    )
}

const PlayerRecentGamesContent = ({
    player,
    games,
}: {
    player: string
    games: OwnedGame[]
}) => {
    return (
        <Paper sx={{ marginTop: "1em" }} elevation={0}>
            <PlayerHeader player={player} />
            <Typography variant="h5">Recent Games</Typography>
            <OwnedGameList
                player={player}
                games={games}
                showCompletion={false}
            />
        </Paper>
    )
}

const PlayerRecentGames = () => {
    const { id: player = throwExpression("missing param") } = useParams()
    const { loading, error, data } = useQueryPlayerOwnedGames({
        player,
        orderBy: "lastPlayed DESC",
        limit: 36,
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return <PlayerRecentGamesContent player={player} games={data} />
            }}
        />
    )
}

export default PlayerRecentGames
