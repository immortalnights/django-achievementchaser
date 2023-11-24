import { Tooltip } from "@mui/material"
import FlexWrappedList from "./FlexWrappedList"
import Link from "./Link"
import GameIcon from "./GameIcon"

const GameResult = ({ game }: { game: Game }) => (
    <Link to={`/Game/${game.id}`}>
        <Tooltip title={game.name} arrow enterDelay={500} leaveDelay={0}>
            <GameIcon {...game} />
        </Tooltip>
    </Link>
)

const SearchGameResults = ({ items }: { items: Game[] }) => {
    let content

    if (items.length > 0) {
        content = (
            <FlexWrappedList justifyContent="flex-start">
                {items.map((item) => (
                    <li key={item.id}>
                        <GameResult game={item} />
                    </li>
                ))}
            </FlexWrappedList>
        )
    } else {
        content = <div>No results</div>
    }

    return content
}

export default SearchGameResults
