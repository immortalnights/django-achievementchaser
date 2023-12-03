import { Stack } from "@mui/material"
import GameCapsule from "./GameCapsule"

const PlayerOwnedGames = ({
    player,
    ownedGames,
}: {
    player: string
    ownedGames: PlayerOwnedGame[]
}) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={0.75}
        >
            {ownedGames.map((ownedGame) => (
                <GameCapsule
                    key={ownedGame.game.id}
                    player={player}
                    game={ownedGame.game}
                    ownedGame={ownedGame}
                />
            ))}
        </Stack>
    )
}

export default PlayerOwnedGames
