import type { PlayerProfileSettings } from "./types"

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
