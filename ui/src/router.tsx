import { Params, RouteObject, createHashRouter } from "react-router-dom"
import App from "./App"
import { Home, Game, SearchResults } from "./screens"
import PlayerLayout from "./layouts/Player"
import { throwExpression } from "./utilities"
import { client } from "./api/client"
import { player, gameComplete, search } from "./api/documents"
import { redirect } from "react-router"

const playerLoader = async ({ params }: { params: Params }) => {
    const { id = throwExpression("missing param") } = params

    const { data, error } = await client.request<PlayerQueryResponse>({
        query: player,
        variables: { player: id },
    })

    if (error) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw redirect(`/`)
    }

    return data?.player
}

const playerGameLoader = async ({ params }: { params: Params }) => {
    const { gameId = throwExpression("missing param") } = params

    const { data, error } = await client.request<GameQueryResponse>({
        query: gameComplete,
        variables: { game: Number(gameId) },
    })

    if (error) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw redirect(`/Player/${params.id}`)
    }

    return data?.game
}

const gameLoader = async ({ params }: { params: Params }) => {
    const { gameId = throwExpression("missing param") } = params

    const { data, error } = await client.request<GameQueryResponse>({
        query: gameComplete,
        variables: { game: Number(gameId) },
    })

    if (error) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw redirect(`/`)
    }

    return data?.game
}

const playerRoutes = {
    path: "/Player/:id/*",
    id: "player",
    loader: playerLoader,
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
            loader: playerGameLoader,
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
