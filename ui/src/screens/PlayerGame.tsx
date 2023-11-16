import { useParams, useRouteLoaderData } from "react-router-dom"
import Loader from "../components/Loader"
import { useQueryPlayerGame } from "../api/queries"
import { throwExpression } from "../utilities"
import PlayerGameHeader from "../components/PlayerGameHeader"
import PlayerGameAchievements from "../components/PlayerGameAchievements"

const PlayerGameContainer = () => {
    const player = useRouteLoaderData("player") as Player
    const { gameId: game = throwExpression("Missing 'game' parameter") } =
        useParams()
    const { loading, error, data } = useQueryPlayerGame({
        player: player.id,
        game: game,
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(ownedGame) => (
                <>
                    <PlayerGameHeader
                        player={player.id}
                        ownedGame={ownedGame}
                    />
                    <PlayerGameAchievements
                        achievements={ownedGame.game.achievements ?? []}
                        playerAchievements={
                            ownedGame.unlockedAchievements ?? []
                        }
                    />
                </>
            )}
        />
    )
}

export default PlayerGameContainer
