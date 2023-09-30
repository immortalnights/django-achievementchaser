import { useParams } from "react-router-dom"
import { Typography } from "@mui/material"
import {
    useQueryPlayer,
    useQueryPlayerAchievements,
    useQueryPlayerOwnedGames,
} from "../api/queries"
import Loader from "../components/Loader"
import { throwExpression } from "../utilities"
import OwnedGameList from "../components/OwnedGameList"
import GameAchievementsList from "../components/GameAchievementsList"

const PlayerAlmostThereGames = ({ player }: { player: string }) => {
    const { loading, error, data } = useQueryPlayerOwnedGames({
        player,
        played: true,
        started: true,
        perfect: false,
        limit: 12,
        orderBy: "completionPercentage DESC",
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <OwnedGameList
                        player={player}
                        games={data}
                        showCompletion={true}
                    />
                )
            }}
        />
    )
}

const PlayerJustStartedGames = ({ player }: { player: string }) => {
    const { loading, error, data } = useQueryPlayerOwnedGames({
        player,
        played: true,
        started: true,
        limit: 12,
        orderBy: "completionPercentage ASC",
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <OwnedGameList
                        player={player}
                        games={data}
                        showCompletion={true}
                    />
                )
            }}
        />
    )
}

const PlayerEasiestGames = ({ player }: { player: string }) => {
    const { loading, error, data } = useQueryPlayerOwnedGames({
        player,
        perfect: false,
        limit: 12,
        orderBy: "difficultyPercentage DESC",
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <OwnedGameList
                        player={player}
                        games={data}
                        showCompletion={false}
                    />
                )
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

const PlayerProfileContent = (player: Player) => {
    return (
        <>
            <Typography variant="h5">Almost There</Typography>
            <PlayerAlmostThereGames player={player.id} />
            <Typography variant="h5">Just Started</Typography>
            <PlayerJustStartedGames player={player.id} />
            <Typography variant="h5">Next Game</Typography>
            <PlayerEasiestGames player={player.id} />
            <Typography variant="h5">Next Achievement</Typography>
            <PlayerGameAchievementList player={player.id} />
        </>
    )
}

const PlayerProfileScreen = () => {
    const { id = throwExpression("missing param") } = useParams()
    const { loading, error, data } = useQueryPlayer(id)

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return <PlayerProfileContent {...data} />
            }}
        />
    )
}

export default PlayerProfileScreen
