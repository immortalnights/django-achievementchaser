import FlexWrappedList from "./FlexWrappedList"
import GameCard from "./GameCard"

const PlayerOwnedGames = ({
    player,
    ownedGames,
}: {
    player: string
    ownedGames: PlayerOwnedGame[]
}) => {
    return (
        <FlexWrappedList>
            {ownedGames.map((ownedGame) => (
                <li key={ownedGame.game.id}>
                    <GameCard
                        {...ownedGame}
                        {...ownedGame.game}
                        player={player}
                    />
                </li>
            ))}
        </FlexWrappedList>
    )
}

export default PlayerOwnedGames
