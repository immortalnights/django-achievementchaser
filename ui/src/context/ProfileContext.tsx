import { createContext } from "react"

interface PlayerProfileSettings {
    hideGameStatistics: boolean
    ignoredGames: string[]
}

interface PlayerProfileContextValue extends PlayerProfileSettings {
    toggleGameStatistics: () => void
    addIgnoredGame: (game: string) => void
}

export const loadFromLocalStorage = () => ({
    hideGameStatistics: localStorage.getItem("hideGameStatistics") === "true",
    ignoredGames: JSON.parse(
        localStorage.getItem("ignoredGames") ?? "[]"
    ) as string[],
})

export const saveToLocalStorage = (state: PlayerProfileSettings) => {
    localStorage.setItem(
        "hideGameStatistics",
        state.hideGameStatistics ? "true" : "false"
    )
    localStorage.setItem("ignoredGames", JSON.stringify(state.ignoredGames))
}

const PlayerProfileContext = createContext<PlayerProfileContextValue>({
    hideGameStatistics: false,
    ignoredGames: [],
    toggleGameStatistics: () => {},
    addIgnoredGame: (game: string) => {},
})

export default PlayerProfileContext
