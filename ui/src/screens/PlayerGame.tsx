import { useParams } from "react-router-dom"
import Loader from "../components/Loader"
import { useQueryPlayerGame } from "../api/queries"
import { throwExpression } from "../utilities"
import PlayerGameHeader from "../components/PlayerGameHeader"
import PlayerGameAchievements from "../components/PlayerGameAchievements"

const PlayerGameContainer = () => {
    const { id: player = throwExpression("Missing 'player' parameter") } =
        useParams()
    const { gameId: game = throwExpression("Missing 'game' parameter") } =
        useParams()
    const { loading, error, data } = useQueryPlayerGame({
        player,
        game,
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <>
                        <PlayerGameHeader player={player} {...data} />
                        <PlayerGameAchievements
                            achievements={data.achievements}
                            playerAchievements={data.playerAchievements}
                        />
                    </>
                )
            }}
        />
    )
}

export default PlayerGameContainer
