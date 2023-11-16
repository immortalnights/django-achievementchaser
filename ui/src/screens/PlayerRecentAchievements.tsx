import { useRouteLoaderData } from "react-router-dom"
import { unwrapEdges } from "../api/utils"
import Loader from "../components/Loader"
import GameGroupedAchievements from "../components/GameGroupedAchievements"
import { Typography } from "@mui/material"
import { playerUnlockedAchievements } from "../api/documents"
import { useQuery } from "graphql-hooks"

const PlayerRecentAchievements = () => {
    const player = useRouteLoaderData("player") as Player
    const { loading, data, error } = useQuery<PlayerQueryResponse>(
        playerUnlockedAchievements,
        { variables: { player: player.id, limit: 24 } }
    )

    return (
        <>
            <Typography variant="h5">Recent Achievements</Typography>
            <Loader
                loading={loading}
                error={error}
                data={data}
                renderer={(response) => {
                    const achievements = unwrapEdges(
                        response?.player?.unlockedAchievements
                    )
                    return (
                        <GameGroupedAchievements
                            player={player.id}
                            achievements={achievements}
                            rows={1}
                        />
                    )
                }}
            />
        </>
    )
}

export default PlayerRecentAchievements
