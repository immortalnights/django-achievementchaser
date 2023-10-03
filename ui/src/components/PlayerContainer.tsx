import { Paper, Box } from "@mui/material"
import { useState, useMemo, useEffect } from "react"
import { useLoaderData, Outlet } from "react-router-dom"
import PlayerProfileContext from "../context/ProfileContext"
import {
    loadFromLocalStorage,
    saveToLocalStorage,
} from "../context/localStorage"
import PlayerProfileHeader from "./PlayerHeader"

const PlayerContainer = () => {
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

    const { player } = useLoaderData() as PlayerQueryResponse

    return (
        <PlayerProfileContext.Provider value={contextValue}>
            <PlayerProfileHeader {...player!} />
            <Paper elevation={0}>
                <Box>
                    <Outlet />
                </Box>
            </Paper>
        </PlayerProfileContext.Provider>
    )
}

export default PlayerContainer
