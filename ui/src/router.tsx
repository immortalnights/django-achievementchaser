import { RouteObject, createHashRouter, useLoaderData } from "react-router-dom"
import { request } from "graphql-request"
import gqlDocument from "./api/graphql-documents"
import App from "./App"
import { Home, Game, SearchResults } from "./screens"
import PlayerContainer from "./components/PlayerContainer"
import { throwExpression } from "./utilities"

const playerRoutes = {
    path: "/Player/*",
    id: "player",
    loader: async ({ params }) => {
        const { id = throwExpression("missing param") } = params
        const document = gqlDocument.player(id)
        return request<PlayerQueryResponse>(
            "/graphql/",
            `{${String(document)}\n}`
        ).then((response) => response.player)
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
            path: ":id/RecentAchievements",
            async lazy() {
                const { PlayerRecentAchievements } = await import(
                    "./screens/player"
                )
                return { Component: PlayerRecentAchievements }
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
                    const document = gqlDocument.game(id, {
                        includeAchievements: true,
                        includeOwners: true,
                    })
                    return request<GameQueryResponse>(
                        "/graphql/",
                        `{${String(document)}\n}`
                    )
                },
                Component: Game,
            },
            {
                path: "/Search/:name",
                loader: async ({ params }) => {
                    const { name = "" } = params
                    const document = gqlDocument.search(name)
                    return name
                        ? request<SearchQueryResponse>(
                              "/graphql/",
                              `{${String(document)}\n}`
                          )
                        : null
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
