import { useState, useMemo, useEffect } from "react"
import { useLoaderData, Outlet } from "react-router-dom"
import {
    loadFromLocalStorage,
    saveToLocalStorage,
} from "@/context/localStorage"
import PlayerProfileHeader from "@/components/PlayerHeader"
import {
    default as PlayerSettingsContext,
    AchievementSortOrder,
    PlayerSettingsContextValue,
} from "@/context/PlayerSettingsContext"

const PlayerContainer = () => {
    const [contextState, setContextState] = useState(loadFromLocalStorage())

    const contextValue = useMemo(
        () =>
            ({
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
                setAchievementSortOrder: (order: AchievementSortOrder) => {
                    setContextState((value) => ({
                        ...value,
                        achievementSortOrder: order,
                    }))
                },
                setHideUnlockedAchievements: (hide: boolean) => {
                    setContextState((value) => ({
                        ...value,
                        hideUnlockedAchievements: hide,
                    }))
                },
            }) satisfies PlayerSettingsContextValue,
        [contextState]
    )

    useEffect(() => {
        saveToLocalStorage(contextState)
    }, [contextState])

    const player = useLoaderData<Player>()

    return (
        <PlayerSettingsContext.Provider value={contextValue}>
            <PlayerProfileHeader {...player} />
            <Outlet />
        </PlayerSettingsContext.Provider>
    )
}

export default PlayerContainer
