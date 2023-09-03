import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Paper, Typography } from "@mui/material"
import {
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
        orderBy: "completionPercentage",
        ignoreComplete: true,
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
        orderBy: "completionPercentage ASC",
        ignoreNotStarted: true,
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
        orderBy: "difficultyPercentage DESC",
        ignoreComplete: true,
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

const PlayerProfileContent = (profile: PlayerProfile) => {
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
                <PlayerProfileHeader
                    id={profile.id}
                    name={profile.name}
                    avatarLargeUrl={profile.avatarLargeUrl}
                    summary={profile.summary}
                />
                <Typography variant="h5">Almost There</Typography>
                <PlayerAlmostThereGames player={profile.id} />
                <Typography variant="h5">Just Started</Typography>
                <PlayerJustStartedGames player={profile.id} />
                <Typography variant="h5">Next Game</Typography>
                <PlayerEasiestGames player={profile.id} />
                <Typography variant="h5">Next Achievement</Typography>
                <PlayerGameAchievementList player={profile.id} />
            </Paper>
        </PlayerProfileContext.Provider>
    )
}

const PlayerProfileScreen = () => {
    const { id = throwExpression("missing param") } = useParams()
    const { loading, error, data } = useQueryPlayerProfile(id)

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
