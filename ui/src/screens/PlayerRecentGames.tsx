import { useParams } from "react-router-dom"
import { useQueryPlayerOwnedGames } from "../api/queries"
import Loader from "../components/Loader"
import OwnedGameList from "../components/OwnedGameList"
import { throwExpression } from "../utilities"
import { Typography } from "@mui/material"

const PlayerRecentGamesContent = ({
    player,
    games,
}: {
    player: string
    games: OwnedGame[]
}) => {
    return (
        <>
            <Typography variant="h5">Recent Games</Typography>
            <OwnedGameList player={player} games={games} />
        </>
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
