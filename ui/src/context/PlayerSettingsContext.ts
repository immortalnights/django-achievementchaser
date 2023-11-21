import { createContext } from "react"

type AchievementSortOrder = "difficulty" | "unlocked"

export interface PlayerSettings {
    hideGameStatistics: boolean
    ignoredGames: string[]
    achievementSortOrder: AchievementSortOrder
    hideUnlockedAchievements: boolean
}

export interface PlayerSettingsContextValue extends PlayerSettings {
    toggleGameStatistics: () => void
    addIgnoredGame: (game: string) => void
    setAchievementSortOrder: (order: AchievementSortOrder) => void
    setHideUnlockedAchievements: (hide: boolean) => void
}

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
