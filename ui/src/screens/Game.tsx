import { useParams } from "react-router-dom"
import { request, gql } from "graphql-request"
import { useEffect, useState } from "react"

const GameHeader = ({
    id,
    name,
    image,
    achievementCount = 0,
}: {
    id: number
    name: string
    image: string
    achievementCount?: number
}) => {
    return (
        <div>
            <div>
                <h3>{name}</h3>
                <p>Total Achievements {achievementCount}</p>
                <p>Difficulty: ?% to ?%</p>
            </div>
            <div>
                <img
                    src={`https://media.steampowered.com/steam/apps/${id}/capsule_184x69.jpg`}
                />
            </div>
        </div>
    )
}

const GameDetails = ({ game }: { game: Game }) => {
    return (
        <>
            <GameHeader id={game.id} name={game.name} image={game.iconUrl} />
        </>
    )
}

const GameScreen = () => {
    const { id } = useParams()

    const [game, setGame] = useState<Game>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>()

    useEffect(() => {
        request<GameResponse>(
            "/graphql/",
            gql`
                {
                    game(id: 221810) {
                        id
                        name
                        imgIconUrl
                        achievementSet {
                            id
                            name
                            displayName
                            description
                            iconGrayUrl
                            globalPercentage
                        }
                    }
                }
            `
        )
            .then((resp) => {
                console.log(resp)
                setLoading(false)
                setGame(resp.game)
            })
            .catch((err) => {
                setLoading(false)
                setError("Failed")
            })
    }, [])

    let content
    if (loading) {
        content = <div>Loading...</div>
    } else if (game) {
        content = <GameDetails game={game} />
    } else if (error) {
        content = <div>Error.</div>
    }

    return <div>{content}</div>
}

export default GameScreen
