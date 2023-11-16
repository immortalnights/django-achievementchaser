import { useRouteLoaderData } from "react-router-dom"
import { Typography } from "@mui/material"
import LoadPlayerOwnedGames from "../components/LoadPlayerOwnedGames"

const PlayerRecentGames = () => {
    const player = useRouteLoaderData("player") as Player

    return (
        <>
            <Typography variant="h5">Recent Games</Typography>
            <LoadPlayerOwnedGames
                player={player.id}
                order="-lastPlayed"
                limit={36}
            />
        </>
    )
}

export default PlayerRecentGames
