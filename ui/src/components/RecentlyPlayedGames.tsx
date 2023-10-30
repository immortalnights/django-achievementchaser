import { Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { getRelativeTime } from "../utilities"
import BorderedImage from "./BorderedImage"

const RecentlyPlayedGame = ({
    player,
    game,
}: {
    player: string
    game: RecentGame
}) => {
    const lastPlayed = getRelativeTime(game.lastPlayed)

    return (
        <Link to={`/Player/${player}/Game/${game.id}`}>
            <BorderedImage
                title={`${game.name} last played ${lastPlayed}`}
                src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.id}/${game.imgIconUrl}.jpg`}
                style={{ display: "block" }}
            />
        </Link>
    )
}

const RecentlyPlayedGames = ({
    player,
    games,
}: {
    player: string
    games: RecentGame[]
}) => (
    <ul
        style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            gap: 8,
            alignItems: "center",
        }}
    >
        {games.map((game) => (
            <li key={game.id}>
                <RecentlyPlayedGame player={player} game={game} />
            </li>
        ))}
        <li>
            <Link to={`/Player/${player}/RecentGames`}>
                <Typography fontSize={"small"}>more...</Typography>
            </Link>
        </li>
    </ul>
)

export default RecentlyPlayedGames
