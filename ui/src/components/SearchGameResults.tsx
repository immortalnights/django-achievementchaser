import { Stack, Tooltip } from "@mui/material"
import Link from "./Link"
import GameIcon from "./GameIcon"

const GameResult = ({ game }: { game: Game }) => (
    <Link to={`/Game/${game.id}`}>
        <Tooltip title={game.name} arrow enterDelay={500} leaveDelay={0}>
            <GameIcon {...game} />
        </Tooltip>
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
