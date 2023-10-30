import { Typography } from "@mui/material"
import { useLoaderData } from "react-router-dom"
import SearchGameResults from "../components/SearchGameResults"
import SearchPlayerResults from "../components/SearchPlayerResults"

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
            <SearchPlayerResults items={players} />
            <Typography variant="h5">Games</Typography>
            <SearchGameResults items={games} />
        </div>
    )
}

export default SearchResults
