import { Paper, Box } from "@mui/material"
import { useState, useMemo, useEffect } from "react"
import { useLoaderData, Outlet } from "react-router-dom"
import PlayerSettingsContext from "../context/PlayerSettingsContext"
import {
    loadFromLocalStorage,
    saveToLocalStorage,
} from "../context/localStorage"
import PlayerProfileHeader from "./PlayerHeader"
import {
    AchievementSortOrder,
    PlayerSettingsContextValue,
} from "../context/types"

const PlayerContainer = () => {
    const [contextState, setContextState] = useState(loadFromLocalStorage())

    const toggleGameStatistics = () => {
        setContextState((value) => ({
            ...value,
            hideGameStatistics: !value.hideGameStatistics,
        }))
    }

    const addIgnoredGame = (game: string) => {
        setContextState((value) => ({
            ...value,
            ignoredGames: [...value.ignoredGames, game],
        }))
    }

    const setAchievementSortOrder = (order: AchievementSortOrder) => {
        setContextState((value) => ({
            ...value,
            achievementSortOrder: order,
        }))
    }

    const setHideUnlockedAchievements = (hide: boolean) => {
        setContextState((value) => ({
            ...value,
            hideUnlockedAchievements: hide,
        }))
    }

    const contextValue = useMemo(
        () =>
            ({
                ...contextState,
                toggleGameStatistics,
                addIgnoredGame,
                setAchievementSortOrder,
                setHideUnlockedAchievements,
            }) satisfies PlayerSettingsContextValue,
        [contextState]
    )

    useEffect(() => {
        saveToLocalStorage(contextState)
    }, [contextState])

    const { player } = useLoaderData() as PlayerQueryResponse

    return (
        <PlayerSettingsContext.Provider value={contextValue}>
            <PlayerProfileHeader {...player!} />
            <Paper elevation={0}>
                <Box>
                    <Outlet />
                </Box>
            </Paper>
        </PlayerSettingsContext.Provider>
    )
}

export default PlayerContainer
