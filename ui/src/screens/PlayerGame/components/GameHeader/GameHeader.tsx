import { Stack } from "@mui/material"
import GameTitle from "@/components/GameTitle"
import GameIcon from "@/components/GameIcon"
import GameDifficulty from "@/components/GameDifficulty"
import AchievementControls from "../AchievementControls"
import Details from "../Details"

const GameHeader = ({
    game,
    owner,
    compare,
}: {
    game: Game
    owner?: Omit<PlayerOwnedGame, "game">
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
                            <Details game={game} owner={owner} />
                        ) : (
                            <div style={{ flexGrow: 1 }} />
                        )}

                        {gameAchievementCount > 0 && (
                            <AchievementControls game={game} owner={owner} />
                        )}
                    </>
                )}
            </Stack>
        </>
    )
}

export default GameHeader
