import { Tooltip } from "@mui/material"
import BorderedImage from "./BorderedImage"
import FlexWrappedList from "./FlexWrappedList"
import Link from "./Link"

const SearchPlayerResult = ({ id, name, avatarMediumUrl }: Player) => {
    const titleEl = name

    return (
        <Link to={`/Player/${id}`}>
            <Tooltip title={titleEl} arrow enterDelay={500} leaveDelay={0}>
                <BorderedImage src={avatarMediumUrl} />
            </Tooltip>
        </Link>
    )
}

const SearchPlayerResults = ({ items }: { items: Player[] }) => {
    let content

    if (items.length > 0) {
        content = (
            <FlexWrappedList justifyContent="flex-start">
                {items.map((item) => (
                    <li key={item.id}>
                        <SearchPlayerResult {...item} />
                    </li>
                ))}
            </FlexWrappedList>
        )
    } else {
        content = <div>No results</div>
    }

    return content
}

export default SearchPlayerResults
