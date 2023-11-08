import { useRouteLoaderData } from "react-router-dom"
import { Typography } from "@mui/material"
import { useQueryPlayerAchievements } from "../api/queries"
import Loader from "../components/Loader"
import GameAchievementsList from "../components/GameAchievementsList"
import LoadPlayerOwnedGames from "../components/LoadPlayerOwnedGames"

const PlayerGameAchievementList = ({ player }: { player: string }) => {
    const { loading, error, data } = useQueryPlayerAchievements({
        player,
        unlocked: false,
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
                        rows={3}
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
