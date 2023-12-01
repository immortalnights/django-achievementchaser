import { Typography } from "@mui/material"
import { useLoaderData } from "react-router-dom"
import SearchGameResults from "@/components/SearchGameResults"
import SearchPlayerResults from "@/components/SearchPlayerResults"

const SearchResults = () => {
    const results = useLoaderData() as SearchQueryResults

    const players: Player[] = []
    const games: Game[] = []

    results.forEach((item) => {
        if ("playerId" in item) {
            players.push({ ...item, id: item.playerId })
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
