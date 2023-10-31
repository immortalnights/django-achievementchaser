import { createContext } from "react"
import type { PlayerSettingsContextValue } from "./types"

const PlayerSettingsContext = createContext<PlayerSettingsContextValue>({
    hideGameStatistics: false,
    ignoredGames: [],
    achievementSortOrder: "difficulty",
    hideUnlockedAchievements: false,

    toggleGameStatistics: () => {
        console.error("Called abstract context function `toggleGameStatistics`")
    },
    addIgnoredGame: () => {
        console.error("Called abstract context function `addIgnoredGame`")
    },
    setAchievementSortOrder: () => {
        console.error(
            "Called abstract context function `setAchievementSortOrder`"
        )
    },
    setHideUnlockedAchievements: () => {
        console.error(
            "Called abstract context function `setHideUnlockedAchievements`"
        )
    },
})

export default PlayerSettingsContext
