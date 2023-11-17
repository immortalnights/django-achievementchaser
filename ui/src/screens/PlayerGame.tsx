import { useParams, useRouteLoaderData } from "react-router-dom"
import Loader from "../components/Loader"
import { throwExpression } from "../utilities"
import PlayerGameHeader from "../components/PlayerGameHeader"
import PlayerGameAchievements from "../components/PlayerGameAchievements"
import { useQuery } from "graphql-hooks"
import { gameWithPlayerAchievements, playerGame } from "../api/documents"

const PlayerGameContainer = () => {
    const player = useRouteLoaderData("player") as Player
    const { gameId: game = throwExpression("Missing 'game' parameter") } =
        useParams()
    const { loading, data, error } = useQuery<PlayerQueryResponse>(playerGame, {
        variables: { player: player.id, game },
    })

    const { data: gameData } = useQuery<GameQueryResponse>(
        gameWithPlayerAchievements,
        {
            variables: { game: Number(game), players: [player.id] },
        }
    )

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(response) => {
                const { game: ownedGame } = response.player!
                return (
                    <>
                        <PlayerGameHeader
                            player={player.id}
                            ownedGame={ownedGame!}
                        />
                        <PlayerGameAchievements
                            achievements={ownedGame!.game.achievements ?? []}
                            playerAchievements={
                                ownedGame!.unlockedAchievements ?? []
                            }
                        />
                    </>
                )
            }}
        />
    )
}

export default PlayerGameContainer
