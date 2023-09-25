import styled from "@emotion/styled"
import { Link } from "react-router-dom"
import BorderedImage from "./BorderedImage"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

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
    dayjs.extend(relativeTime)

    let title = `${game.name}`
    if (showCompletion) {
        const completionDate = dayjs(game.completed)
        if (game.completed) {
            title += ` - ${completionDate.format(
                "MMM D, YYYY"
            )} (${completionDate.fromNow()})`
        } else if (game.completionPercentage) {
            title += ` - ${(game.completionPercentage * 100).toFixed(
                2
            )}% Complete`
        }
    } else if (game.lastPlayed) {
        const lastPlayed = dayjs(game.lastPlayed).format("MMM D, YYYY")
        title += ` - ${lastPlayed}`
    } else if (game.difficultyPercentage) {
        title += ` - ${game.difficultyPercentage.toFixed(2)}%`
    }

    return (
        <ReactiveLink to={`/game/${game.id}?player=${player}`}>
            <BorderedImage
                src={`https://media.steampowered.com/steam/apps/${game.id}/capsule_184x69.jpg`}
                title={title}
            />
        </ReactiveLink>
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
