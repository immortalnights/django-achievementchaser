import { Stack } from "@mui/material"
import { GameCompletionProgress } from "@/components/GameCompletionProgress"
import OwnedGameLastPlayed from "@/components/OwnedGameLastPlayed"
import OwnedGamePlaytime from "@/components/OwnedGamePlaytime"

const PlayerGameDetails = ({
    game,
    owner,
}: {
    game: Game
    owner: Omit<PlayerOwnedGame, "game">
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

export default PlayerGameDetails
