import { Alert, Stack, Tooltip } from "@mui/material"
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

const SearchPlayerResults = ({ players }: { players: Player[] }) => {
    let content

    if (players.length > 0) {
        content = (
            <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={0.75}
            >
                {players.map((item) => (
                    <SearchPlayerResult key={item.id} {...item} />
                ))}
            </Stack>
        )
    } else {
        content = <Alert severity="info">No results</Alert>
    }

    return content
}

export default SearchPlayerResults
