import { useParams } from "react-router-dom"
import { throwExpression } from "../utilities"
import { useQueryPlayerAchievements } from "../api/queries"
import Loader from "../components/Loader"
import GameAchievementsList from "../components/GameAchievementsList"

const PlayerRecentAchievements = () => {
    const { id: player = throwExpression("missing param") } = useParams()
    const { loading, error, data } = useQueryPlayerAchievements({
        player,
        unlocked: true,
        limit: 24,
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <GameAchievementsList
                        player={player}
                        achievements={data}
                        rows={1}
                    />
                )
            }}
        />
    )
}

export default PlayerRecentAchievements
