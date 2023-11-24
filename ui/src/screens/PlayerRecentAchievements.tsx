import { useRouteLoaderData } from "react-router-dom"
import { unwrapEdges } from "../api/utils"
import Loader from "../components/Loader"
import GameGroupedAchievements from "../components/GameGroupedAchievements"
import { Box, IconButton, Typography } from "@mui/material"
import { playerUnlockedAchievements } from "../api/documents"
import { useQuery } from "graphql-hooks"
import { DateRangeTwoTone } from "@mui/icons-material"

const PlayerRecentAchievements = () => {
    const player = useRouteLoaderData("player") as Player
    const { loading, data, error } = useQuery<PlayerQueryResponse>(
        playerUnlockedAchievements,
        { variables: { player: player.id, limit: 24 } }
    )

    return (
        <>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h5">Recent Achievements</Typography>
                <IconButton disabled>
                    <DateRangeTwoTone />
                </IconButton>
            </Box>
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
