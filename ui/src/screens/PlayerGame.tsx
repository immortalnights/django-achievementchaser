import { useParams, useRouteLoaderData } from "react-router-dom"
import Loader from "../components/Loader"
import { throwExpression } from "../utilities"
import GameAchievements from "../components/PlayerGameAchievements"
import { useQuery } from "graphql-hooks"
import { gameWithPlayers } from "../api/documents"
import { useState } from "react"
import PlayerCompareContext, {
    PlayerCompareContextValue,
} from "../context/PlayerCompareContext"
import { unwrapEdges } from "../api/utils"
import GameIcon from "../components/GameIcon"
import { Box } from "@mui/material"
import { GameCompletionProgress } from "../components/GameCompletionProgress"
import PlayerSelect from "../components/PlayerSelect"
import HideUnlockedAchievementsButton from "../components/HideUnlockedAchievementsButton"
import OrderAchievementsButton from "../components/OrderAchievementsButton"
import ClearComparisonButton from "../components/ClearComparisonButton"
import GameTitle from "../components/GameTitle"
import GameDifficulty from "../components/GameDifficulty"
import OwnedGameLastPlayed from "../components/OwnedGameLastPlayed"
import OwnedGamePlaytime from "../components/OwnedGamePlaytime"
import PlayerGameCompareHeader from "../components/PlayerGameCompareHeader"

const GameHeader = ({
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
    const gameAchievementsCount = game.achievements?.length ?? 0

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <GameIcon {...game} />
            <GameDifficulty difficulty={game.difficultyPercentage} />
            {player1Owner && !compare ? (
                <>
                    <GameCompletionProgress
                        player={player1Owner.player!}
                        achievements={gameAchievementsCount}
                        playerAchievements={player1Achievements}
                    />
                    <OwnedGameLastPlayed {...player1Owner} />
                    <OwnedGamePlaytime {...player1Owner} />
                    <PlayerSelect filter={[player1Owner.player?.id!]} />
                </>
            ) : (
                <Box flexGrow={0.85} />
            )}
            <Box>
                {compare && <ClearComparisonButton />}
                <HideUnlockedAchievementsButton />
                <OrderAchievementsButton />
            </Box>
        </Box>
    )
}

const GameDetails = ({
    game,
    player1,
    player2,
}: {
    game: Game
    player1: string
    player2?: string
}) => {
    const owners = unwrapEdges(game.owners)
    const player1Owner = owners.find((item) => item.player?.id === player1)
    const player2Owner = owners.find((item) => item.player?.id === player2)

    const playerAchievements = unwrapEdges(game.playerAchievements)
    const player1Achievements = playerAchievements.filter(
        (item) => item.player.id === player1
    )
    const player2Achievements = player2
        ? playerAchievements.filter((item) => item.player.id === player2)
        : undefined

    return (
        <Box>
            <GameTitle {...game} />
            {player1Owner && (
                <>
                    <GameHeader
                        game={game}
                        player1Owner={player1Owner}
                        player1Achievements={player1Achievements.length}
                        compare={!!player2Owner}
                    />
                    {player2Owner && (
                        <PlayerGameCompareHeader
                            gameAchievementCount={
                                game.achievements?.length ?? 0
                            }
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
        gameWithPlayers,
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

    return (
        <PlayerCompareContext.Provider value={contextValue}>
            <Loader
                loading={loading}
                error={error}
                data={data}
                renderer={(response) => (
                    <GameDetails
                        game={response.game!}
                        player1={player.id}
                        player2={comparePlayer}
                    />
                )}
            />
        </PlayerCompareContext.Provider>
    )
}

export default PlayerGameContainer
