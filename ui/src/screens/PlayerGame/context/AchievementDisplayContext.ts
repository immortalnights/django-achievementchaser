import { createContext } from "react"

export interface AchievementDisplayContextValue {
    filter: string | undefined
    setFilter: (filter: string) => void
    otherPlayer: string | undefined
    setOtherPlayer: (player: string | undefined) => void
}

const AchievementDisplayContext = createContext<AchievementDisplayContextValue>(
    {
        filter: undefined,
        setFilter: () => {
            console.error("Called abstract context function `setFilter`")
        },
        otherPlayer: undefined,
        setOtherPlayer: () => {
            console.error("Called abstract context function `setOtherPlayer`")
        },
    }
)

export default AchievementDisplayContext
