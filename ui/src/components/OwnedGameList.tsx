import styled from "@emotion/styled"
import { Link } from "react-router-dom"
import BorderedImage from "./BorderedImage"

const FlexWrappedList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 0.25em;
`

const ReactiveLink = styled(Link)``

const GameItem = ({
    player,
    game,
    showCompletion,
}: {
    player: string
    game: OwnedGame
    showCompletion: boolean
}) => {
    let title = `${game.name}`
    if (showCompletion && game.completionPercentage) {
        title += ` - ${(game.completionPercentage * 100).toFixed(2)}% Complete`
    } else if (game.difficultyPercentage) {
        title += ` - ${game.difficultyPercentage.toFixed(2)}`
    }

    return (
        <li>
            <ReactiveLink to={`/player/${player}/game/${game.id}`}>
                <BorderedImage
                    src={`https://media.steampowered.com/steam/apps/${game.id}/capsule_184x69.jpg`}
                    title={title}
                />
            </ReactiveLink>
        </li>
    )
}

const OwnedGameList = ({
    player,
    games,
    showCompletion,
}: {
    player: string
    games: OwnedGame[]
    showCompletion: boolean
}) => {
    return (
        <FlexWrappedList>
            {games.map((game) => (
                <li key={game.id}>
                    <GameItem
                        player={player}
                        game={game}
                        showCompletion={showCompletion}
                    />
                </li>
            ))}
        </FlexWrappedList>
    )
}

export default OwnedGameList
