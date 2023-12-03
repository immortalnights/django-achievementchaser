import { useRouteLoaderData } from "react-router-dom"
import { Box, Button, Typography } from "@mui/material"
import { playerPerfectGames } from "@/api/documents"
import { useQuery } from "graphql-hooks"
import { unwrapEdges } from "@/api/utils"
import PlayerOwnedGames from "@/components/PlayerOwnedGames"
import Loader from "@/components/Loader"

const LoadPlayerPerfectGames = ({
    player,
    order,
    limit = 12,
}: {
    player: string
    order?: string
    limit?: number
}) => {
    const { loading, error, data } = useQuery<PlayerQueryResponse>(
        playerPerfectGames,
        { variables: { player, orderBy: order, limit } }
    )
    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(response) => {
                const games = unwrapEdges(response.player?.games)
                return (
                    <>
                        <PlayerOwnedGames player={player} ownedGames={games} />
                        <Box marginY={2} display="none" justifyContent="center">
                            <Button variant="outlined">Load More</Button>
                        </Box>
                    </>
                )
            }}
        />
    )
}

const PlayerPerfectGames = () => {
    const player = useRouteLoaderData("player") as Player

    return (
        <>
            <Typography variant="h5">Perfect Games</Typography>
            <LoadPlayerPerfectGames
                player={player.id}
                order="-completed"
                limit={25}
            />
        </>
    )
}

export default PlayerPerfectGames
