import BorderedImage from "./BorderedImage"

const GameIconList = ({ player, games }: { player: string; games: Game[] }) => {
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
                    <a
                        href={`/player/${player}/game/${game.id}`}
                        title={game.name}
                    >
                        <BorderedImage
                            src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.id}/${game.imgIconUrl}.jpg`}
                        />
                    </a>
                </li>
            ))}
        </ul>
    )
}

export default GameIconList