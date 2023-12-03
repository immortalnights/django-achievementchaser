import { Alert, Stack } from "@mui/material"
import GameCapsule from "./GameCapsule"

const SearchGameResults = ({ games }: { games: Game[] }) =>
    games.length > 0 ? (
        <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={0.75}
        >
            {games.map((game) => (
                <GameCapsule key={game.id} game={game} />
            ))}
        </Stack>
    ) : (
        <Alert severity="info">No results</Alert>
    )

export default SearchGameResults
