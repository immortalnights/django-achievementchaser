import { useParams } from "react-router-dom"
import { request, gql } from "graphql-request"
import { useEffect, useState } from "react"

const GameHeader = ({
    id,
    name,
    image,
    achievements = [],
}: {
    id: number
    name: string
    image: string
    achievements?: WithRequired<Achievement, "globalPercentage">[]
}) => {
    const min = achievements.reduce<number | undefined>(
        (min, achievement) =>
            min && min < achievement.globalPercentage
                ? min
                : achievement.globalPercentage,
        0
    )
    const max = achievements.reduce(
        (max, achievement) =>
            max < achievement.globalPercentage
                ? achievement.globalPercentage
                : max,
        0
    )
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flexGrow: 1, textAlign: "left" }}>
                <h3 style={{ margin: 4 }}>{name}</h3>
                <p style={{ margin: 4 }}>
                    Total Achievements {achievements.length}
                </p>
                <p style={{ margin: 4 }}>
                    Difficulty: {min?.toFixed(2)}% to {max.toFixed(2)}%
                </p>
            </div>
            <div
                style={{
                    margin: 8,
                    fontSize: "small",
                    alignContent: "flex-start",
                }}
            >
                <a
                    href={`http://store.steampowered.com/app/${id}`}
                    target="_blank"
                >
                    View on Steam
                </a>
            </div>
            <div>
                <img
                    src={`https://media.steampowered.com/steam/apps/${id}/capsule_184x69.jpg`}
                />
            </div>
        </div>
    )
}

const AchievementItem = ({
    name,
    displayName,
    description,
    iconUrl,
    globalPercentage,
}: Achievement) => {
    return (
        <li style={{ display: "flex", margin: "0.25em" }}>
            <img src={iconUrl} style={{ width: 64, height: 64 }} />
            <div
                style={{
                    display: "flex",
                    flexGrow: 1,
                    border: "1px solid white",
                    borderRadius: 5,
                    marginLeft: "0.5em",
                }}
            >
                <div
                    style={{
                        flexGrow: 1,
                        textAlign: "left",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            zIndex: -1,
                            backgroundColor: "#607d8b",
                            margin: "4px",
                            height: "54px",
                            borderRadius: "3px",
                            width: `${globalPercentage}%`,
                        }}
                    ></div>
                    <h4 style={{ margin: "0.125em 0 0 0.5em" }}>
                        {displayName}
                    </h4>
                    <p style={{ margin: "0.125em 0 0 0.5em" }}>{description}</p>
                </div>
                <div>
                    <span>{globalPercentage?.toFixed(2)}%</span>
                </div>
            </div>
        </li>
    )
}

const GameDetails = ({
    game,
}: {
    game: WithRequired<Game, "name" | "iconUrl" | "achievements">
}) => {
    return (
        <>
            <GameHeader
                id={game.id}
                name={game.name}
                achievements={game.achievements}
                image={game.iconUrl}
            />
            <hr />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {game.achievements.map((achievement) => (
                    <AchievementItem key={achievement.name} {...achievement} />
                ))}
            </ul>
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
                    game(id: ${id}) {
                        id
                        name
                        imgIconUrl
                        achievements {
                          name
                          displayName
                          description
                          iconUrl
                          globalPercentage
                        }
                      }
                }
            `
        )
            .then((resp) => {
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