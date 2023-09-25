import { createHashRouter } from "react-router-dom"
import { request } from "graphql-request"
import gqlDocument from "./api/graphql-documents"
import App from "./App"
import {
    Home,
    PlayerProfile,
    PlayerPerfectGames,
    PlayerRecentAchievements,
    PlayerFriends,
    Game,
} from "./screens"
import PlayerRecentGames from "./screens/PlayerRecentGames"
import PlayerContainer from "./components/PlayerContainer"

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
                    const document = gqlDocument.player(params.id ?? "")
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
                        path: ":id/Friends",
                        Component: PlayerFriends,
                    },
                ],
            },
            {
                path: "/Game/:id",
                Component: Game,
            },
        ],
    },
    {
        path: "*",
        element: <div>404 Not Found</div>,
    },
])

export default router
