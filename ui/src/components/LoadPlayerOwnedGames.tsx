import { useQuery } from "graphql-hooks"
import { unwrapEdges } from "@/api/utils"
import Loader from "./Loader"
import PlayerOwnedGames from "./PlayerOwnedGames"
import { playerGames } from "@/api/documents"

const LoadPlayerOwnedGames = ({
    player,
    started,
    completed,
    order,
    limit = 12,
}: {
    player: string
    started?: boolean
    completed?: boolean
    order?: string
    limit?: number
}) => {
    const { loading, error, data } = useQuery<PlayerQueryResponse>(
        playerGames,
        { variables: { player, started, completed, orderBy: order, limit } }
    )
    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(response) => {
                const games = unwrapEdges(response.player?.games)
                return <PlayerOwnedGames player={player} ownedGames={games} />
            }}
        />
    )
}

export default LoadPlayerOwnedGames
