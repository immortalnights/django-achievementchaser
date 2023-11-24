import { Stack } from "@mui/material"
import GameCard from "./GameCard"

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
                <GameCard
                    key={ownedGame.game.id}
                    {...ownedGame}
                    {...ownedGame.game}
                    player={player}
                />
            ))}
        </Stack>
    )
}

export default PlayerOwnedGames
