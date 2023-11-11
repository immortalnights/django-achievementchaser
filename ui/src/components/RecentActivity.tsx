import { Typography } from "@mui/material"
import { useQueryPlayerRecent } from "../api/queries"
import Loader from "./Loader"
import RecentlyPlayedGames from "./RecentlyPlayedGames"
import RecentlyUnlockedAchievements from "./RecentlyUnlockedAchievements"

const RecentActivityContent = ({
    player,
    games,
    achievements,
}: {
    player: string
    games: PlayerOwnedGame[]
    achievements: PlayerUnlockedAchievement[]
}) => (
    <>
        <Typography variant="subtitle1" textTransform="uppercase">
            Recently Played
        </Typography>
        <RecentlyPlayedGames player={player} games={games} />

        <Typography variant="subtitle1" textTransform="uppercase">
            Recently Unlocked
        </Typography>
        <RecentlyUnlockedAchievements
            player={player}
            achievements={achievements}
        />
    </>
)

const RecentActivity = ({ player }: { player: string }) => {
    const { loading, error, data } = useQueryPlayerRecent(player)

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <RecentActivityContent
                        player={player}
                        games={data.games}
                        achievements={data.achievements}
                    />
                )
            }}
        />
    )
}

export default RecentActivity
