import styled from "@emotion/styled"
import OwnedGame from "./OwnedGame"

const FlexWrappedList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 0.25em;
`

const OwnedGameList = ({
    player,
    games,
}: {
    player: string
    games: OwnedGame[]
}) => {
    return (
        <FlexWrappedList>
            {games.map((game) => (
                <li key={game.id}>
                    <OwnedGame player={player} game={game} />
                </li>
            ))}
        </FlexWrappedList>
    )
}

export default OwnedGameList
