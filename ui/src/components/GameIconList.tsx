import { Link } from "react-router-dom"
import BorderedImage from "./BorderedImage"

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
                        to={`/game/${game.id}?player=${player}`}
                        title={game.name}
                    >
                        <BorderedImage
                            title={`Last played ${game.lastPlayed}`}
                            src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.id}/${game.imgIconUrl}.jpg`}
                        />
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default GameIconList
