import { Stack, Tooltip } from "@mui/material"
import BorderedImage from "./BorderedImage"
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
            <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={0.75}
            >
                {items.map((item) => (
                    <SearchPlayerResult key={item.id} {...item} />
                ))}
            </Stack>
        )
    } else {
        content = <div>No results</div>
    }

    return content
}

export default SearchPlayerResults
