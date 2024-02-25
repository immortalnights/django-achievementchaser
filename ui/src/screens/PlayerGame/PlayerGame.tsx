import { useLoaderData, useRouteLoaderData } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import AchievementDisplayContext, {
    AchievementDisplayContextValue,
} from "./context/AchievementDisplayContext"
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

    const [filter, setFilter] = useState<string>()
    const [comparePlayer, setComparePlayer] = useState<string>()

    const contextValue: AchievementDisplayContextValue = {
        filter,
        setFilter: (value: string) => setFilter(value),
        otherPlayer: comparePlayer,
        setOtherPlayer: (value: string | undefined) => setComparePlayer(value),
    }

    useEffect(() => {
        setFilter(undefined)
        setComparePlayer(undefined)
    }, [game])

    const owners = useMemo(() => unwrapEdges(game.owners), [game])
    const player1Owner = owners.find((owner) => owner.player?.id === player.id)
    const player2Owner = owners.find(
        (owner) => owner.player?.id === comparePlayer
    )
    const compare = !!player2Owner

    const gameWithFilteredAchievements = useMemo(() => {
        const filterLower = filter?.toLowerCase()
        const copy = { ...game }

        copy.achievements = game.achievements?.filter((achievement) => {
            return filterLower
                ? achievement.displayName.toLowerCase().includes(filterLower) ||
                      achievement.description
                          ?.toLowerCase()
                          .includes(filterLower)
                : true
        })

        return copy
    }, [game, filter])

    return (
        <AchievementDisplayContext.Provider value={contextValue}>
            <GameHeader game={game} owner={player1Owner} compare={compare} />

            {player1Owner && player2Owner && (
                <PlayerGameCompareHeader
                    gameAchievementCount={game.achievements?.length ?? 0}
                    player1Owner={player1Owner}
                    player2Owner={player2Owner}
                />
            )}

            <GameAchievementsContainer
                game={gameWithFilteredAchievements}
                player1={player1Owner?.player}
                player2={player2Owner?.player}
            />
        </AchievementDisplayContext.Provider>
    )
}

export default PlayerGameContainer
