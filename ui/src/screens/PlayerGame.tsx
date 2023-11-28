import { useParams, useRouteLoaderData } from "react-router-dom"
import Loader from "@/components/Loader"
import { throwExpression } from "@/utilities"
import GameAchievements from "@/components/PlayerGameAchievements"
import { useQuery } from "graphql-hooks"
import { gameWithOwnerAchievements } from "@/api/documents"
import { useEffect, useMemo, useState } from "react"
import PlayerCompareContext, {
    PlayerCompareContextValue,
} from "@/context/PlayerCompareContext"
import { unwrapEdges } from "@/api/utils"
import GameIcon from "@/components/GameIcon"
import { Box } from "@mui/material"
import { GameCompletionProgress } from "@/components/GameCompletionProgress"
import {
    PlayerSelect,
    HideUnlockedAchievementsButton,
    OrderAchievementsButton,
    ClearComparisonButton,
} from "@/components/controls"
import GameTitle from "@/components/GameTitle"
import GameDifficulty from "@/components/GameDifficulty"
import OwnedGameLastPlayed from "@/components/OwnedGameLastPlayed"
import OwnedGamePlaytime from "@/components/OwnedGamePlaytime"
import PlayerGameCompareHeader from "@/components/PlayerGameCompareHeader"

const OwnedGameAchievementProgress = ({
    game,
    playerOwner,
    playerAchievements,
}: {
    game: Game
    playerOwner: PlayerOwnedGame
    playerAchievements: number
}) => (
    <>
        <GameCompletionProgress
            player={playerOwner.player!}
            achievements={game.achievements?.length ?? 0}
            playerAchievements={playerAchievements}
        />

        <PlayerSelect
            game={game.id}
            excludePlayers={[playerOwner.player?.id ?? ""]}
        />
    </>
)

const OwnedGameHeader = ({
    game,
    player1Owner,
    player1Achievements,
    compare = false,
}: {
    game: Game
    player1Owner: PlayerOwnedGame
    player1Achievements: number
    compare?: boolean
}) => {
    const gameAchievementCount = game.achievements?.length ?? 0

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <GameIcon {...game} />
            <GameDifficulty difficulty={game.difficultyPercentage} />
            {player1Owner && !compare ? (
                <>
                    <OwnedGameLastPlayed {...player1Owner} />
                    <OwnedGamePlaytime {...player1Owner} />
                    {gameAchievementCount > 0 ? (
                        <OwnedGameAchievementProgress
                            game={game}
                            playerOwner={player1Owner}
                            playerAchievements={player1Achievements}
                        />
                    ) : (
                        <Box flexGrow={0.5} />
                    )}
                </>
            ) : (
                <Box flexGrow={0.85} />
            )}

            {gameAchievementCount > 0 && (
                <Box>
                    {compare && <ClearComparisonButton />}
                    <HideUnlockedAchievementsButton />
                    <OrderAchievementsButton />
                </Box>
            )}
        </Box>
    )
}

const GameDetails = ({
    game,
    player1: player1Owner,
    player2: player2Owner,
}: {
    game: Omit<Game, "owners">
    player1?: PlayerOwnedGame
    player2?: PlayerOwnedGame
}) => {
    const player1Achievements =
        unwrapEdges(player1Owner?.player?.unlockedAchievements) ?? []
    const player2Achievements = player2Owner
        ? unwrapEdges(player2Owner.player?.unlockedAchievements)
        : undefined

    const gameAchievementCount = game.achievements?.length ?? 0

    return (
        <Box>
            <GameTitle game={game} />
            {player1Owner && (
                <>
                    <OwnedGameHeader
                        game={game}
                        player1Owner={player1Owner}
                        player1Achievements={player1Achievements.length}
                        compare={!!player2Owner}
                    />
                    {gameAchievementCount > 0 && player2Owner && (
                        <PlayerGameCompareHeader
                            gameAchievementCount={gameAchievementCount}
                            player1Owner={player1Owner}
                            player1Achievements={player1Achievements.length}
                            player2Owner={player2Owner}
                            player2Achievements={
                                player2Achievements?.length ?? 0
                            }
                        />
                    )}
                </>
            )}
            <GameAchievements
                achievements={game.achievements ?? []}
                player1Achievements={player1Achievements}
                player2Achievements={player2Achievements}
            />
        </Box>
    )
}

const PlayerGameContainer = () => {
    const player = useRouteLoaderData("player") as Player
    const { gameId: game = throwExpression("Missing 'game' parameter") } =
        useParams()
    const [comparePlayer, setComparePlayer] = useState<string>()

    const { loading, data, error } = useQuery<GameQueryResponse>(
        gameWithOwnerAchievements,
        {
            variables: {
                game: Number(game),
                players: [player.id, ...(comparePlayer ? [comparePlayer] : [])],
            },
        }
    )

    const contextValue: PlayerCompareContextValue = {
        otherPlayer: comparePlayer,
        setOtherPlayer: (value: string | undefined) => setComparePlayer(value),
    }

    useEffect(() => {
        setComparePlayer(undefined)
    }, [game])

    const owners = useMemo(() => unwrapEdges(data?.game?.owners), [data])

    return (
        <PlayerCompareContext.Provider value={contextValue}>
            <Loader
                loading={loading}
                error={error}
                data={data}
                renderer={(response) => (
                    <GameDetails
                        game={response.game!}
                        player1={owners.find(
                            (owner) => owner.player?.id === player.id
                        )}
                        player2={owners.find(
                            (owner) => owner.player?.id === comparePlayer
                        )}
                    />
                )}
            />
        </PlayerCompareContext.Provider>
    )
}

export default PlayerGameContainer
