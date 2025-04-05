import { useRouteLoaderData } from "react-router-dom"
import { Typography } from "@mui/material"
import { useLoadPlayerPerfectGames } from "@/api/utils"
import PlayerOwnedGames from "@/components/PlayerOwnedGames"

const PlayerPerfectGames = () => {
    const player = useRouteLoaderData("player") as Player

    const games = useLoadPlayerPerfectGames({
        player: player.id,
        orderBy: "-completed",
    })

    document.title = `${player.name} · Perfect Games · Achievement Chaser`

    return (
        <>
            <Typography variant="h5">Perfect Games</Typography>
            <PlayerOwnedGames player={player.id} ownedGames={games} />
        </>
    )
}

export default PlayerPerfectGames
