import { useQueryPlayerGames } from "../api/queries"
import Loader from "./Loader"
import PlayerOwnedGames from "./PlayerOwnedGames"

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
    const { loading, error, data } = useQueryPlayerGames({
        player,
        started,
        completed,
        orderBy: order,
        limit,
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(ownedGames) => {
                return (
                    <PlayerOwnedGames player={player} ownedGames={ownedGames} />
                )
            }}
        />
    )
}

export default LoadPlayerOwnedGames
