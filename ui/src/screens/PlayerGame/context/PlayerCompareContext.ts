import { createContext } from "react"

export interface PlayerCompareContextValue {
    otherPlayer?: string
    setOtherPlayer: (player: string | undefined) => void
}

const PlayerCompareContext = createContext<PlayerCompareContextValue>({
    otherPlayer: undefined,

    setOtherPlayer: () => {
        console.error("Called abstract context function `setOtherPlayer`")
    },
})

export default PlayerCompareContext
