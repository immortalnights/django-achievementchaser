import { RouteObject, createHashRouter } from "react-router-dom"
import App from "./App"
import { Home, Game, SearchResults } from "./screens"
import PlayerContainer from "./components/PlayerContainer"
import { throwExpression } from "./utilities"
import { client } from "./api/client"
import { player, gameComplete, search } from "./api/documents"

const playerRoutes = {
    path: "/Player/*",
    id: "player",
    loader: async ({ params }) => {
        const { id = throwExpression("missing param") } = params

        const { data } = await client.request<PlayerQueryResponse>({
            query: player,
            variables: { player: id },
        })
        return data?.player
    },
    Component: PlayerContainer,
    children: [
        {
            path: ":id",
            async lazy() {
                const { PlayerProfile } = await import("./screens/player")
                return { Component: PlayerProfile }
            },
        },
        {
            path: ":id/PerfectGames",
            async lazy() {
                const { PlayerPerfectGames } = await import("./screens/player")
                return { Component: PlayerPerfectGames }
            },
        },
        {
            path: ":id/RecentGames",
            async lazy() {
                const { PlayerRecentGames } = await import("./screens/player")
                return { Component: PlayerRecentGames }
            },
        },
        {
            path: ":id/Achievements/:date?",
            async lazy() {
                const { PlayerAchievements } = await import("./screens/player")
                return { Component: PlayerAchievements }
            },
        },
        {
            path: ":id/Game/:gameId",
            async lazy() {
                const { PlayerGame } = await import("./screens/player")
                return { Component: PlayerGame }
            },
        },
        {
            path: ":id/Friends",
            async lazy() {
                const { PlayerFriends } = await import("./screens/player")
                return { Component: PlayerFriends }
            },
        },
    ],
} satisfies RouteObject

const router = createHashRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                Component: Home,
            },
            playerRoutes,
            {
                path: "/Game/:id",
                loader: async ({ params }) => {
                    const { id = throwExpression("missing param") } = params

                    const { data } = await client.request<GameQueryResponse>({
                        query: gameComplete,
                        variables: { game: Number(id) },
                    })

                    return data?.game
                },
                Component: Game,
            },
            {
                path: "/Search/:name",
                loader: async ({ params }) => {
                    const { name = "" } = params
                    const { data } = await client.request<SearchQueryResponse>({
                        query: search,
                        variables: { name },
                    })
                    return data?.searchPlayersAndGames
                },
                Component: SearchResults,
            },
        ],
    },
    {
        path: "*",
        element: <div>404 Not Found</div>,
    },
])

export default router
