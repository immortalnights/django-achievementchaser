import { createContext } from "react"
import type { PlayerProfileContextValue } from "./types"

const PlayerProfileContext = createContext<PlayerProfileContextValue>({
    hideGameStatistics: false,
    ignoredGames: [],
    toggleGameStatistics: () => {
        console.error("Called abstract context function `toggleGameStatistics`")
    },
    addIgnoredGame: () => {
        console.error("Called abstract context function `addIgnoredGame`")
    },
})

export default PlayerProfileContext
