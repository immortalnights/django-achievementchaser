import { useLoaderData, useRouteLoaderData } from "react-router-dom"
import { useContext, useEffect, useMemo, useState } from "react"
import PlayerCompareContext, {
    PlayerCompareContextValue,
} from "@/context/PlayerCompareContext"
import { unwrapEdges } from "@/api/utils"
import GameIcon from "@/components/GameIcon"
import { Box, Stack } from "@mui/material"
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
import GameAchievementsContainer from "@/components/GameAchievementsContainer"

const PlayerGameDetails = ({
    game,
    owner,
}: {
    game: Game
    owner: GameOwner
}) => {
    const gameAchievementCount = game.achievements?.length ?? 0
    const playerAchievements = owner.unlockedAchievementCount ?? 0

    return (
        <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            flexGrow={1}
            gap={5}
            useFlexGap
        >
            <OwnedGameLastPlayed {...owner} />
            <OwnedGamePlaytime {...owner} />

            {gameAchievementCount > 0 ? (
                <GameCompletionProgress
                    achievements={game.achievements?.length ?? 0}
                    playerAchievements={playerAchievements}
                />
            ) : (
                <div style={{ flexGrow: 1 }} />
            )}
        </Stack>
    )
}

const PlayerGameControls = ({
    game,
    owner,
}: {
    game: Game
    owner: GameOwner
}) => {
    const { otherPlayer, setOtherPlayer } = useContext(PlayerCompareContext)

    const players = useMemo(
        () =>
            unwrapEdges(game.owners)
                .map((owner) => owner.player)
                .filter(
                    (player) => player && owner?.player?.id !== player.id
                ) as Player[],
        [game, owner]
    )

    return (
        <Box>
            {!otherPlayer && (
                <PlayerSelect
                    options={players}
                    value={otherPlayer}
                    onChange={setOtherPlayer}
                />
            )}

            {otherPlayer && <ClearComparisonButton />}
            <HideUnlockedAchievementsButton />
            <OrderAchievementsButton />
        </Box>
    )
}

const GameHeader = ({
    game,
    owner,
    compare,
}: {
    game: Game
    owner?: GameOwner
    compare: boolean
}) => {
    const gameAchievementCount = game.achievements?.length ?? 0

    return (
        <>
            <GameTitle game={game} />
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                useFlexGap
                spacing={2}
            >
                <GameIcon {...game} />
                {gameAchievementCount > 0 && (
                    <>
                        <GameDifficulty
                            difficulty={game.difficultyPercentage}
                        />
                        <div style={{ width: "2em" }} />
                    </>
                )}

                {owner && (
                    <>
                        {!compare ? (
                            <PlayerGameDetails game={game} owner={owner} />
                        ) : (
                            <div style={{ flexGrow: 1 }} />
                        )}

                        {gameAchievementCount > 0 && (
                            <PlayerGameControls game={game} owner={owner} />
                        )}
                    </>
                )}
            </Stack>
        </>
    )
}

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
