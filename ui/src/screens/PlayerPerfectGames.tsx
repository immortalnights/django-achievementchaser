import { useParams } from "react-router-dom"
import { useQueryPlayerGames } from "../api/queries"
import Loader from "../components/Loader"
import { throwExpression } from "../utilities"
import { Typography } from "@mui/material"
import FlexWrappedList from "../components/FlexWrappedList"
import GameCard from "../components/GameCard"

const PerfectGameList = ({
    player,
    ownedGames,
}: {
    player: string
    ownedGames: PlayerOwnedGame[]
}) => {
    return (
        <FlexWrappedList>
            {ownedGames.map((ownedGame) => (
                <li key={ownedGame.game!.id}>
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

const PlayerPerfectGames = () => {
    const { id: player = throwExpression("missing param") } = useParams()
    const { loading, error, data } = useQueryPlayerGames({
        player,
        completed: true,
        orderBy: "-completed",
    })

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(ownedGames) => {
                return (
                    <>
                        <Typography variant="h5">Perfect Games</Typography>
                        <PerfectGameList
                            player={player}
                            ownedGames={ownedGames}
                        />
                    </>
                )
            }}
        />
    )
}

export default PlayerPerfectGames
