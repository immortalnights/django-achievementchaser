import { useRouteLoaderData } from "react-router-dom"
import { useQueryPlayerAchievements } from "../api/queries"
import Loader from "../components/Loader"
import GameAchievementsList from "../components/GameAchievementsList"
import { Typography } from "@mui/material"

const PlayerRecentAchievements = () => {
    const player = useRouteLoaderData("player") as Player

    const { loading, error, data } = useQueryPlayerAchievements({
        player: player.id,
        limit: 24,
    })

    return (
        <>
            <Typography variant="h5">Recent Achievements</Typography>
            <Loader
                loading={loading}
                error={error}
                data={data}
                renderer={(data) => {
                    return (
                        <GameAchievementsList
                            player={player.id}
                            achievements={data}
                            rows={1}
                        />
                    )
                }}
            />
        </>
    )
}

export default PlayerRecentAchievements
