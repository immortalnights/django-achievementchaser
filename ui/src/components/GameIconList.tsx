import { Link } from "react-router-dom"
import BorderedImage from "./BorderedImage"
import { RecentGame } from "../api/queries"

const GameIconList = ({
    player,
    games,
}: {
    player: string
    games: RecentGame[]
}) => {
    return (
        <ul
            style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                gap: 8,
            }}
        >
            {games.map((game) => (
                <li key={game.id}>
                    <Link
                        to={`/player/${player}/game/${game.id}`}
                        title={game.name}
                    >
                        <BorderedImage
                            src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.id}/${game.imgIconUrl}.jpg`}
                        />
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default GameIconList
