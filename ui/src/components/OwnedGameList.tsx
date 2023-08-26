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

const OwnedGameList = ({
    player,
    games,
}: {
    player: string
    games: OwnedGame[]
}) => {
    const set = games.slice(0, 12)

    return (
        <FlexWrappedList>
            {set.map((game) => (
                <li key={game.game.id}>
                    <ReactiveLink to={`/player/${player}/game/${game.game.id}`}>
                        <BorderedImage
                            src={`https://media.steampowered.com/steam/apps/${game.game.id}/capsule_184x69.jpg`}
                            title={`${game.game.name} - ${(
                                game.completionPercentage * 100
                            ).toFixed(2)}%`}
                        />
                    </ReactiveLink>
                </li>
            ))}
        </FlexWrappedList>
    )
}

export default OwnedGameList
