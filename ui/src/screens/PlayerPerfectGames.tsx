import { useRouteLoaderData } from "react-router-dom"
import { Typography } from "@mui/material"
import LoadPlayerOwnedGames from "@/components/LoadPlayerOwnedGames"

const PlayerPerfectGames = () => {
    const player = useRouteLoaderData("player") as Player

    return (
        <>
            <Typography variant="h5">Perfect Games</Typography>
            <LoadPlayerOwnedGames
                player={player.id}
                completed={true}
                order="-completed"
                limit={100}
            />
        </>
    )
}

export default PlayerPerfectGames
