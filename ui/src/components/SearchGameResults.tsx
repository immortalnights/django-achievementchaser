import { Stack } from "@mui/material"
import Link from "./Link"
import { GameIconWithTooltip } from "./GameIcon"

const GameResult = ({ game }: { game: Game }) => (
    <Link to={`/Game/${game.id}`}>
        <GameIconWithTooltip game={game} tooltip={game.name} />
    </Link>
)

const SearchGameResults = ({ items }: { items: Game[] }) =>
    items.length > 0 ? (
        <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={0.75}
        >
            {items.map((item) => (
                <GameResult key={item.id} game={item} />
            ))}
        </Stack>
    ) : (
        <div>No results</div>
    )

export default SearchGameResults
