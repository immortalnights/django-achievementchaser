import { styled, Typography, Tooltip } from "@mui/material"
import emostyled from "@emotion/styled"
import { Link, useLoaderData } from "react-router-dom"
import BorderedImage from "../components/BorderedImage"

// COPY
const ReactiveLink = styled(Link)``

// COPY
const FlexWrappedList = emostyled.ul<{ justifyContent?: string }>`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: ${(props) => props.justifyContent ?? "space-evenly"};
    gap: 0.25em;
`

const PlayerResult = ({ id, name, avatarMediumUrl }: Player) => {
    const titleEl = name

    return (
        <ReactiveLink to={`/Player/${id}`}>
            <Tooltip title={titleEl} arrow enterDelay={500} leaveDelay={0}>
                <BorderedImage src={avatarMediumUrl} />
            </Tooltip>
        </ReactiveLink>
    )
}

// FIXME copy of "OwnedGame" stuff...
const GameResult = ({ id, name }: Game) => {
    const titleEl = name
    return (
        <ReactiveLink to={`/Game/${id}`}>
            <Tooltip title={titleEl} arrow enterDelay={500} leaveDelay={0}>
                <BorderedImage
                    src={`https://media.steampowered.com/steam/apps/${id}/capsule_184x69.jpg`}
                />
            </Tooltip>
        </ReactiveLink>
    )
}

const PlayerResults = ({ items }: { items: Player[] }) => {
    let content

    if (items.length > 0) {
        content = (
            <FlexWrappedList justifyContent="flex-start">
                {items.map((item) => (
                    <li key={item.id}>
                        <PlayerResult {...item} />
                    </li>
                ))}
            </FlexWrappedList>
        )
    } else {
        content = <div>No results</div>
    }

    return content
}

const GameResults = ({ items }: { items: Game[] }) => {
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

const SearchResults = () => {
    const data = useLoaderData() as SearchQueryResponse

    const players: Player[] = []
    const games: Game[] = []

    data.searchPlayersAndGames.forEach((item) => {
        if ("avatarMediumUrl" in item) {
            players.push(item)
        } else if ("imgIconUrl" in item) {
            games.push(item)
        }
    })

    return (
        <div>
            <Typography variant="h4">Search</Typography>
            <Typography variant="h5">Players</Typography>
            <PlayerResults items={players} />
            <Typography variant="h5">Games</Typography>
            <GameResults items={games} />
        </div>
    )
}

export default SearchResults
