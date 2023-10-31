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
