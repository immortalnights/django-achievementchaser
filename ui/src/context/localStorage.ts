import type { PlayerSettings } from "./PlayerSettingsContext"

export const loadFromLocalStorage = (): PlayerSettings => {
    const achievementSortOrder =
        localStorage.getItem("achievementSortOrder") === "unlocked"
            ? "unlocked"
            : "difficulty"

    return {
        hideGameStatistics:
            localStorage.getItem("hideGameStatistics") === "true",
        ignoredGames: JSON.parse(
            localStorage.getItem("ignoredGames") ?? "[]"
        ) as string[],
        achievementSortOrder: achievementSortOrder,
        hideUnlockedAchievements:
            localStorage.getItem("hideUnlockedAchievements") === "true",
    }
}

export const saveToLocalStorage = (state: PlayerSettings) => {
    localStorage.setItem(
        "hideGameStatistics",
        state.hideGameStatistics ? "true" : "false"
    )
    localStorage.setItem("ignoredGames", JSON.stringify(state.ignoredGames))
    localStorage.setItem("achievementSortOrder", state.achievementSortOrder)
    localStorage.setItem(
        "hideUnlockedAchievements",
        state.hideUnlockedAchievements ? "true" : "false"
    )
}
