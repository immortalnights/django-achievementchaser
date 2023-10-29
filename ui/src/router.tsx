import { createHashRouter } from "react-router-dom"
import { request } from "graphql-request"
import gqlDocument from "./api/graphql-documents"
import App from "./App"
import {
    Home,
    PlayerProfile,
    PlayerPerfectGames,
    PlayerRecentAchievements,
    PlayerGame,
    PlayerFriends,
    Game,
    SearchResults,
} from "./screens"
import PlayerRecentGames from "./screens/PlayerRecentGames"
import PlayerContainer from "./components/PlayerContainer"
import { throwExpression } from "./utilities"

const router = createHashRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: "/Player/*",
                loader: ({ params }) => {
                    const { id = throwExpression("missing param") } = params
                    const document = gqlDocument.player(id)
                    return request<PlayerQueryResponse>(
                        "/graphql/",
                        `{${String(document)}\n}`
                    )
                },
                Component: PlayerContainer,
                children: [
                    {
                        path: ":id",
                        Component: PlayerProfile,
                    },
                    {
                        path: ":id/PerfectGames",
                        Component: PlayerPerfectGames,
                    },
                    {
                        path: ":id/RecentGames",
                        Component: PlayerRecentGames,
                    },
                    {
                        path: ":id/RecentAchievements",
                        Component: PlayerRecentAchievements,
                    },
                    {
                        path: ":id/Game/:gameId",
                        Component: PlayerGame,
                    },
                    {
                        path: ":id/Friends",
                        Component: PlayerFriends,
                    },
                ],
            },
            {
                path: "/Game/:id",
                loader: ({ params }) => {
                    const { id = throwExpression("missing param") } = params
                    const document = gqlDocument.game(id)
                    return request<GameQueryResponse>(
                        "/graphql/",
                        `{${String(document)}\n}`
                    )
                },
                Component: Game,
            },
            {
                path: "/Search/:name",
                loader: ({ params }) => {
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
