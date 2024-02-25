import { Stack } from "@mui/material"
import GameCompletionProgress from "../GameCompletionProgress"
import OwnedGameLastPlayed from "../OwnedGameLastPlayed"
import OwnedGamePlaytime from "../OwnedGamePlaytime"

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
            alignItems="center"
            flexGrow={0.5}
            gap={2}
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
