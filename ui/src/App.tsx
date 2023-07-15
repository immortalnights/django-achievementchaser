import { useEffect, useMemo, useState } from "react"
import "./App.css"
import { GraphQLClient, request, gql } from "graphql-request"

interface Player {
    id: string
    name?: string
    profileUrl?: string
    avatarSmallUrl?: string
    avatarMediumUrl?: string
    avatarLargeUrl?: string
    created?: string
    added?: string
    updated?: string
    resynchronized?: string | null
    resynchronizationRequired?: boolean
}

interface PlayerNodes {
    node: Player
}

interface PlayersResponse {
    players: {
        edges: PlayerNodes[]
    }
}

const PlayerProfileCard = ({
    id,
    name,
    profileUrl,
    avatarMediumUrl,
}: Player) => {
    return <img src={avatarMediumUrl} />
}

const PlayerProfileList = ({ players }: { players: Player[] }) => {
    return players.map((player) => (
        <PlayerProfileCard key={player.id} {...player} />
    ))
}

const PlayerProfiles = () => {
    const [players, setPlayers] = useState<Player[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>()

    const client = useMemo(() => new GraphQLClient("/graphql/", {}), [])

    const query = gql`
        {
            players {
                edges {
                    node {
                        id
                        name
                        profileUrl
                        avatarMediumUrl
                    }
                }
            }
        }
    `

    useEffect(() => {
        client
            .request<PlayersResponse>(query)
            .then((res) => {
                setPlayers(res.players.edges.map((item) => item.node))
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return (
        <span>
            {loading ? "Loading..." : <PlayerProfileList players={players} />}
        </span>
    )
}

function App() {
    return (
        <>
            <PlayerProfiles />
        </>
    )
}

export default App
