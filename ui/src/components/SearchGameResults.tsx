import { Stack, Tooltip } from "@mui/material"
import BorderedImage from "./BorderedImage"
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
            <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={0.75}
            >
                {items.map((item) => (
                    <GameResult key={item.id} {...item} />
                ))}
            </Stack>
        )
    } else {
        content = <div>No results</div>
    }

    return content
}

export default SearchGameResults
