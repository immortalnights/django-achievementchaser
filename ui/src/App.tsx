import { useEffect, useMemo, useState } from "react"
import "./App.css"
import { GraphQLClient, request, gql } from "graphql-request"
import { RouterProvider } from "react-router-dom"
import router from "./router"

// const PlayerProfileCard = ({
//     id,
//     name,
//     profileUrl,
//     avatarMediumUrl,
// }: Player) => {
//     return <img src={avatarMediumUrl} />
// }

// const PlayerProfileList = ({ players }: { players: Player[] }) => {
//     return players.map((player) => (
//         <PlayerProfileCard key={player.id} {...player} />
//     ))
// }

// const PlayerProfiles = () => {
//     const [players, setPlayers] = useState<Player[]>([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string>()

//     const client = useMemo(() => new GraphQLClient("/graphql/", {}), [])

//     const query = gql`
//         {
//             players {
//                 edges {
//                     node {
//                         id
//                         name
//                         profileUrl
//                         avatarMediumUrl
//                     }
//                 }
//             }
//         }
//     `

//     useEffect(() => {
//         client
//             .request<PlayersResponse>(query)
//             .then((res) => {
//                 setPlayers(res.players.edges.map((item) => item.node))
//                 setLoading(false)
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
//     }, [])

//     return (
//         <span>
//             {loading ? "Loading..." : <PlayerProfileList players={players} />}
//         </span>
//     )
// }

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App
