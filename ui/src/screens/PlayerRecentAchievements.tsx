import { useRouteLoaderData } from "react-router-dom"
import { useQueryUnlockedPlayerAchievements } from "../api/queries"
import Loader from "../components/Loader"
import GameGroupedAchievements from "../components/GameGroupedAchievements"
import { Typography } from "@mui/material"

const PlayerRecentAchievements = () => {
    const player = useRouteLoaderData("player") as Player
    const { loading, error, data } = useQueryUnlockedPlayerAchievements({
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
                        <GameGroupedAchievements
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
