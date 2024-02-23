import { Params, RouteObject, createHashRouter } from "react-router-dom"
import App from "./App"
import { Home, Game, SearchResults } from "./screens"
import PlayerLayout from "./layouts/Player"
import { throwExpression } from "./utilities"
import { client } from "./api/client"
import { player, gameComplete, search } from "./api/documents"

const gameLoader = async ({ params }: { params: Params }) => {
    const { gameId = throwExpression("missing param") } = params

    const { data } = await client.request<GameQueryResponse>({
        query: gameComplete,
        variables: { game: Number(gameId) },
    })

    return data?.game
}

const playerRoutes = {
    path: "/Player/:id/*",
    id: "player",
    loader: async ({ params }) => {
        const { id = throwExpression("missing param") } = params

        const { data } = await client.request<PlayerQueryResponse>({
            query: player,
            variables: { player: id },
        })
        return data?.player
    },
    Component: PlayerLayout,
    children: [
        {
            path: "",
            index: true,
            async lazy() {
                const { PlayerProfile } = await import("./screens/player")
                return { Component: PlayerProfile }
            },
        },
        {
            path: "PerfectGames",
            async lazy() {
                const { PlayerPerfectGames } = await import("./screens/player")
                return { Component: PlayerPerfectGames }
            },
        },
        {
            path: "RecentGames",
            async lazy() {
                const { PlayerRecentGames } = await import("./screens/player")
                return { Component: PlayerRecentGames }
            },
        },
        {
            path: "Achievements/:date?",
            async lazy() {
                const { PlayerAchievements } = await import("./screens/player")
                return { Component: PlayerAchievements }
            },
        },
        {
            path: "Game/:gameId",
            loader: gameLoader,
            async lazy() {
                const { PlayerGame } = await import("./screens/player")
                return { Component: PlayerGame }
            },
        },
        {
            path: "Friends",
            async lazy() {
                const { PlayerFriends } = await import("./screens/player")
                return { Component: PlayerFriends }
            },
        },
    ],
} satisfies RouteObject

const gameRoutes = {
    path: "/Game/:gameId",
    loader: gameLoader,
    Component: Game,
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
            gameRoutes,
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
