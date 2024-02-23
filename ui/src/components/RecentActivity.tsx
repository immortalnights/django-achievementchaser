import { Box, Typography } from "@mui/material"
import Loader from "./Loader"
import RecentlyPlayedGames from "./RecentlyPlayedGames"
import RecentlyUnlockedAchievements from "./RecentlyUnlockedAchievements"
import { playerGames, playerUnlockedAchievements } from "@/api/documents"
import { useQuery } from "graphql-hooks"
import { unwrapEdges } from "@/api/utils"

const RecentlyPlayedGamesLoader = ({ player }: { player: string }) => {
    const { loading, data, error } = useQuery<PlayerQueryResponse>(
        playerGames,
        { variables: { player, orderBy: "-lastPlayed", limit: 6 } }
    )

    return (
        <Box>
            <Typography variant="subtitle1" textTransform="uppercase">
                Recently Played
            </Typography>
            <Loader
                loading={loading}
                error={error}
                data={data}
                renderer={(response) => {
                    const games = unwrapEdges(response.player?.games)
                    return <RecentlyPlayedGames player={player} games={games} />
                }}
            />
        </Box>
    )
}

const RecentlyUnlockedAchievementsLoader = ({ player }: { player: string }) => {
    const { loading, data, error } = useQuery<PlayerQueryResponse>(
        playerUnlockedAchievements,
        { variables: { player, orderBy: "-datetime", limit: 6 } }
    )

    return (
        <Box>
            <Typography variant="subtitle1" textTransform="uppercase">
                Recently Unlocked
            </Typography>
            <Loader
                loading={loading}
                error={error}
                data={data}
                renderer={(response) => {
                    const achievements = unwrapEdges(
                        response.player?.unlockedAchievements
                    )
                    return (
                        <RecentlyUnlockedAchievements
                            player={player}
                            achievements={achievements}
                        />
                    )
                }}
            />
        </Box>
    )
}

const RecentActivity = ({ player }: { player: string }) => {
    return (
        <Box>
            <RecentlyPlayedGamesLoader player={player} />
            <RecentlyUnlockedAchievementsLoader player={player} />
        </Box>
    )
}

export default RecentActivity
