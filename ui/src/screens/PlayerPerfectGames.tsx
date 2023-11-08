import { useParams } from "react-router-dom"
import { useQueryPlayerGames } from "../api/queries"
import Loader from "../components/Loader"
import { throwExpression } from "../utilities"
import { Typography } from "@mui/material"
import PlayerOwnedGames from "../components/PlayerOwnedGames"

const PlayerPerfectGames = () => {
    const { id: player = throwExpression("missing param") } = useParams()
    const { loading, error, data } = useQueryPlayerGames({
        player,
        completed: true,
        orderBy: "-completed",
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(ownedGames) => {
                return (
                    <>
                        <Typography variant="h5">Perfect Games</Typography>
                        <PlayerOwnedGames
                            player={player}
                            ownedGames={ownedGames}
                        />
                    </>
                )
            }}
        />
    )
}

export default PlayerPerfectGames
