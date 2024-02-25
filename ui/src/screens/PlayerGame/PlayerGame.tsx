import { useLoaderData, useRouteLoaderData } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import PlayerCompareContext, {
    PlayerCompareContextValue,
} from "./context/PlayerCompareContext"
import { unwrapEdges } from "@/api/utils"
import PlayerGameCompareHeader from "./components/PlayerGameCompareHeader"
import GameAchievementsContainer from "./components/GameAchievementsContainer"
import GameHeader from "./components/GameHeader"

const PlayerGameContainer = () => {
    const player = useRouteLoaderData("player") as Player
    const game = useLoaderData() as Game

    if (!game) {
        throw "Failed to load game"
    }

    const [comparePlayer, setComparePlayer] = useState<string>()

    const contextValue: PlayerCompareContextValue = {
        otherPlayer: comparePlayer,
        setOtherPlayer: (value: string | undefined) => setComparePlayer(value),
    }

    useEffect(() => {
        setComparePlayer(undefined)
    }, [game])

    const owners = useMemo(() => unwrapEdges(game.owners), [game])
    const player1Owner = owners.find((owner) => owner.player?.id === player.id)
    const player2Owner = owners.find(
        (owner) => owner.player?.id === comparePlayer
    )
    const compare = !!player2Owner

    return (
        <PlayerCompareContext.Provider value={contextValue}>
            <GameHeader game={game} owner={player1Owner} compare={compare} />

            {player1Owner && player2Owner && (
                <PlayerGameCompareHeader
                    gameAchievementCount={game.achievements?.length ?? 0}
                    player1Owner={player1Owner}
                    player2Owner={player2Owner}
                />
            )}

            <GameAchievementsContainer
                game={game}
                player1={player1Owner?.player}
                player2={player2Owner?.player}
            />
        </PlayerCompareContext.Provider>
    )
}

export default PlayerGameContainer
