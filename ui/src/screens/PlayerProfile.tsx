import { useRouteLoaderData } from "react-router-dom"
import { Typography } from "@mui/material"
import { unwrapEdges } from "@/api/utils"
import Loader from "@/components/Loader"
import GameGroupedAchievements from "@/components/GameGroupedAchievements"
import LoadPlayerOwnedGames from "@/components/LoadPlayerOwnedGames"
import { useQuery } from "graphql-hooks"
import { playerAvailableAchievements } from "@/api/documents"

const PlayerGameAchievementList = ({ player }: { player: string }) => {
    const { loading, data, error } = useQuery<PlayerQueryResponse>(
        playerAvailableAchievements,
        {
            variables: {
                player,
                locked: true,
                orderBy: "-globalPercentage",
                limit: 36,
            },
        }
    )

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(response) => {
                const achievements = unwrapEdges(
                    response?.player?.availableAchievements
                )
                return (
                    <GameGroupedAchievements
                        player={player}
                        achievements={achievements}
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
                order="-game_DifficultyPercentage"
            />

            <Typography variant="h5">Next Achievement</Typography>
            <PlayerGameAchievementList player={player.id} />
        </>
    )
}

export default PlayerProfileScreen
