import { Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { getRelativeTime } from "../utilities"
import BorderedImage from "./BorderedImage"

const RecentlyPlayedGame = ({
    player,
    ownedGame,
}: {
    player: string
    ownedGame: PlayerOwnedGame
}) => {
    const lastPlayed = ownedGame.lastPlayed
        ? getRelativeTime(ownedGame.lastPlayed)
        : "Never"
    const gameName = ownedGame?.game.name ?? ""

    return (
        <Link to={`/Player/${player}/Game/${ownedGame.game.id}`}>
            <BorderedImage
                title={`${gameName} last played ${lastPlayed}`}
                src={`http://media.steampowered.com/steamcommunity/public/images/apps/${ownedGame.game.id}/${ownedGame.game.imgIconUrl}.jpg`}
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
    games: PlayerOwnedGame[]
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
        {games.map((ownedGame) => (
            <li key={ownedGame.game.id}>
                <RecentlyPlayedGame player={player} ownedGame={ownedGame} />
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
