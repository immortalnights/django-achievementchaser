import { useLoaderData, useParams, useRouteLoaderData } from "react-router-dom"
import { Typography } from "@mui/material"
import {
    useQueryPlayer,
    useQueryPlayerGames,
    useQueryPlayerAchievements,
    useQueryPlayerOwnedGames,
} from "../api/queries"
import Loader from "../components/Loader"
import { throwExpression } from "../utilities"
import OwnedGameList from "../components/OwnedGameList"
import GameAchievementsList from "../components/GameAchievementsList"
import PlayerOwnedGames from "../components/PlayerOwnedGames"

const PlayerOwnedGamesList = ({
    player,
    started,
    completed,
    order,
}: {
    player: string
    started?: boolean
    completed?: boolean
    order?: string
}) => {
    const { loading, error, data } = useQueryPlayerGames({
        player,
        started,
        completed,
        orderBy: order,
        limit: 12,
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(games) => {
                return <PlayerOwnedGames player={player} ownedGames={games} />
            }}
        />
    )
}

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
            <PlayerOwnedGamesList
                player={player.id}
                completed={false}
                order="-completionPercentage"
            />

            <Typography variant="h5">Just Started</Typography>
            <PlayerOwnedGamesList
                player={player.id}
                started={true}
                order="completionPercentage"
            />

            <Typography variant="h5">Next Game</Typography>
            <PlayerOwnedGamesList
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
