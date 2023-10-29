import { Tooltip, Typography } from "@mui/material"
import Link from "./Link"
import BorderedImage from "./BorderedImage"
import { useMemo } from "react"
import { getRelativeTime } from "../utilities"

const UnlockedAchievementIcon = ({
    player,
    achievement,
}: {
    player: string
    achievement: RecentAchievement
}) => {
    const title = useMemo(
        () => (
            <>
                <Typography>{achievement.game.name}</Typography>
                <Typography fontSize="small">
                    Achievement: {achievement.displayName}
                </Typography>
                <Typography fontSize="small">
                    Unlocked: {getRelativeTime(achievement.unlocked)}
                </Typography>
            </>
        ),
        []
    )

    return (
        <li style={{ paddingRight: 2 }}>
            <Link to={`/Player/${player}/Game/${achievement.game.id}`}>
                <Tooltip title={title} arrow enterDelay={500} leaveDelay={0}>
                    <BorderedImage
                        src={`${achievement.iconUrl}`}
                        style={{
                            width: 32,
                            height: 32,
                            display: "block",
                        }}
                    />
                </Tooltip>
            </Link>
        </li>
    )
}

const RecentlyUnlockedAchievements = ({
    player,
    achievements,
}: {
    player: string
    achievements: RecentAchievement[]
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
            {achievements.map((achievement) => (
                <UnlockedAchievementIcon
                    key={`${achievement.game.id}-${achievement.id}`}
                    player={player}
                    achievement={achievement}
                />
            ))}
            <li>
                <Link to={`/player/${player}/recentachievements`}>
                    <Typography fontSize={"small"}>more...</Typography>
                </Link>
            </li>
        </ul>
    )
}

export default RecentlyUnlockedAchievements
