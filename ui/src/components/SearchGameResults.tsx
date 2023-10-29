import { Tooltip } from "@mui/material"
import BorderedImage from "./BorderedImage"
import FlexWrappedList from "./FlexWrappedList"
import Link from "./Link"

const GameResult = ({ id, name }: Game) => {
    const titleEl = name
    return (
        <Link to={`/Game/${id}`}>
            <Tooltip title={titleEl} arrow enterDelay={500} leaveDelay={0}>
                <BorderedImage
                    src={`https://media.steampowered.com/steam/apps/${id}/capsule_184x69.jpg`}
                />
            </Tooltip>
        </Link>
    )
}
const SearchGameResults = ({ items }: { items: Game[] }) => {
    let content

    if (items.length > 0) {
        content = (
            <FlexWrappedList justifyContent="flex-start">
                {items.map((item) => (
                    <li key={item.id}>
                        <GameResult {...item} />
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
