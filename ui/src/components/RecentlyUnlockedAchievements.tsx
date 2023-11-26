import { Typography } from "@mui/material"
import Link from "./Link"
import UnlockedAchievementIcon from "./UnlockedAchievementIcon"

const RecentlyUnlockedAchievements = ({
    player,
    achievements,
}: {
    player: string
    achievements: PlayerUnlockedAchievement[]
}) => {
    return (
        <ul
            style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                gap: 8,
                alignItems: "center",
            }}
        >
            {achievements.map((unlockedAchievement) => (
                <UnlockedAchievementIcon
                    key={`${unlockedAchievement.game.id}-${unlockedAchievement.achievement.id}`}
                    player={player}
                    unlockedAchievement={unlockedAchievement}
                />
            ))}
            <li>
                <Link to={`/Player/${player}/Achievements`}>
                    <Typography fontSize={"small"}>more...</Typography>
                </Link>
            </li>
        </ul>
    )
}

export default RecentlyUnlockedAchievements
