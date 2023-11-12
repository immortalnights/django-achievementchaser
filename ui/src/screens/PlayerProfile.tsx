import { useRouteLoaderData } from "react-router-dom"
import { Typography } from "@mui/material"
import { useQueryPlayerAvailableAchievements } from "../api/queries"
import Loader from "../components/Loader"
import GameGroupedAchievements from "../components/GameGroupedAchievements"
import LoadPlayerOwnedGames from "../components/LoadPlayerOwnedGames"

const PlayerGameAchievementList = ({ player }: { player: string }) => {
    const { loading, error, data } = useQueryPlayerAvailableAchievements({
        player,
        limit: 36,
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <GameGroupedAchievements
                        player={player}
                        achievements={data}
                        rows={3}
                        maxAchievements={2}
                    />
                )
            }}
        />
    )
}

const PlayerProfileScreen = () => {
    const player = useRouteLoaderData("player") as Player

    return (
        <>
            <Typography variant="h5">Almost There</Typography>
            <LoadPlayerOwnedGames
                player={player.id}
                completed={false}
                order="-completionPercentage"
            />

            <Typography variant="h5">Just Started</Typography>
            <LoadPlayerOwnedGames
                player={player.id}
                started={true}
                order="completionPercentage"
            />

            <Typography variant="h5">Next Game</Typography>
            <LoadPlayerOwnedGames
                player={player.id}
                completed={false}
                order="-game__difficulty_percentage"
            />

            <Typography variant="h5">Next Achievement</Typography>
            <PlayerGameAchievementList player={player.id} />
        </>
    )
}

export default PlayerProfileScreen
