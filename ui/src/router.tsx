import { createBrowserRouter } from "react-router-dom"
import {
    Home,
    PlayerProfile,
    PlayerPerfectGames,
    PlayerRecentAchievements,
    PlayerFriends,
    PlayerGame,
    Game,
} from "./screens"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/Player/:id",
        element: <PlayerProfile />,
    },
    {
        path: "/Player/:id/PerfectGames",
        element: <PlayerPerfectGames />,
    },
    {
        path: "/Player/:id/RecentAchievements",
        element: <PlayerRecentAchievements />,
    },
    {
        path: "/Player/:id/Friends",
        element: <PlayerFriends />,
    },
    {
        path: "/Player/:id/Game/:gameId",
        element: <PlayerGame />,
    },
    {
        path: "/Game/:id",
        element: <Game />,
    },
])

export default router
