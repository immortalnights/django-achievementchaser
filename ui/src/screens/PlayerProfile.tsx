import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Paper, Typography } from "@mui/material"
import {
    useQueryPlayer,
    useQueryPlayerAchievements,
    useQueryPlayerOwnedGames,
    useQueryPlayerProfile,
} from "../api/queries"
import Loader from "../components/Loader"
import { throwExpression } from "../utilities"
import OwnedGameList from "../components/OwnedGameList"
import PlayerProfileHeader from "../components/PlayerHeader"
import PlayerProfileContext from "../context/ProfileContext"
import EasiestGameAchievementsList from "../components/EasiestGameAchievementsList"
import {
    loadFromLocalStorage,
    saveToLocalStorage,
} from "../context/localStorage"

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
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return (
                    <EasiestGameAchievementsList
                        player={player}
                        achievements={data}
                    />
                )
            }}
        />
    )
    return null
}

const PlayerProfileContent = (player: Player) => {
    const [contextState, setContextState] = useState(loadFromLocalStorage())

    const contextValue = useMemo(
        () => ({
            ...contextState,
            toggleGameStatistics: () => {
                setContextState((value) => ({
                    ...value,
                    hideGameStatistics: !value.hideGameStatistics,
                }))
            },
            addIgnoredGame: (game: string) => {
                setContextState((value) => ({
                    ...value,
                    ignoredGames: [...value.ignoredGames, game],
                }))
            },
        }),
        [contextState]
    )

    useEffect(() => {
        saveToLocalStorage(contextState)
    }, [contextState])

    return (
        <PlayerProfileContext.Provider value={contextValue}>
            <Paper sx={{ marginTop: "1em" }} elevation={0}>
                <PlayerProfileHeader {...player} />
                <Typography variant="h5">Almost There</Typography>
                <PlayerAlmostThereGames player={player.id} />
                <Typography variant="h5">Just Started</Typography>
                <PlayerJustStartedGames player={player.id} />
                <Typography variant="h5">Next Game</Typography>
                <PlayerEasiestGames player={player.id} />
                <Typography variant="h5">Next Achievement</Typography>
                {/* <PlayerGameAchievementList player={player.id} /> */}
            </Paper>
        </PlayerProfileContext.Provider>
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
