import { createHashRouter } from "react-router-dom"
import App from "./App"
import {
    Home,
    PlayerProfile,
    PlayerPerfectGames,
    PlayerRecentAchievements,
    PlayerFriends,
    PlayerGame,
    Game,
} from "./screens"

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
                path: "/Player/:id",
                Component: PlayerProfile,
            },
            {
                path: "/Player/:id/PerfectGames",
                Component: PlayerPerfectGames,
            },
            {
                path: "/Player/:id/RecentAchievements",
                Component: PlayerRecentAchievements,
            },
            {
                path: "/Player/:id/Friends",
                Component: PlayerFriends,
            },
            {
                path: "/Player/:id/Game/:gameId",
                Component: PlayerGame,
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
