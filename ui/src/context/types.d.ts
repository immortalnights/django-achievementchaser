export interface PlayerProfileSettings {
    hideGameStatistics: boolean
    ignoredGames: string[]
}

export interface PlayerProfileContextValue extends PlayerProfileSettings {
    toggleGameStatistics: () => void
    addIgnoredGame: (game: string) => void
}
