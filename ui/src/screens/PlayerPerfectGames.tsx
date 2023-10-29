import { useParams } from "react-router-dom"
import { useQueryPlayerOwnedGames } from "../api/queries"
import Loader from "../components/Loader"
import OwnedGameList from "../components/OwnedGameList"
import { throwExpression } from "../utilities"
import { Typography } from "@mui/material"

const PlayerPerfectGames = () => {
    const { id: player = throwExpression("missing param") } = useParams()
    const { loading, error, data } = useQueryPlayerOwnedGames({
        player,
        perfect: true,
        orderBy: "completed DESC",
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(games) => {
                return (
                    <>
                        <Typography variant="h5">Perfect Games</Typography>
                        <OwnedGameList player={player} games={games} />
                    </>
                )
            }}
        />
    )
}

export default PlayerPerfectGames
