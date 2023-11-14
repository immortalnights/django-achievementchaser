import { Tooltip, Typography } from "@mui/material"
import Link from "./Link"
import BorderedImage from "./BorderedImage"
import { useMemo } from "react"
import { getRelativeTime } from "../utilities"

const UnlockedAchievementIcon = ({
    player,
    unlockedAchievement,
}: {
    player: string
    unlockedAchievement: PlayerUnlockedAchievement
}) => {
    const title = useMemo(
        () => (
            <>
                <Typography>{unlockedAchievement.game.name}</Typography>
                <Typography fontSize="small">
                    Achievement: {unlockedAchievement.achievement.displayName}
                </Typography>
                <Typography fontSize="small">
                    Unlocked: {getRelativeTime(unlockedAchievement.datetime)}
                </Typography>
            </>
        ),
        [unlockedAchievement]
    )

    return (
        <li style={{ paddingRight: 2 }}>
            <Link to={`/Player/${player}/Game/${unlockedAchievement.game.id}`}>
                <Tooltip title={title} arrow enterDelay={500} leaveDelay={0}>
                    <BorderedImage
                        src={`${unlockedAchievement.achievement.iconUrl ?? ""}`}
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
                <Link to={`/Player/${player}/RecentAchievements`}>
                    <Typography fontSize={"small"}>more...</Typography>
                </Link>
            </li>
        </ul>
    )
}

export default RecentlyUnlockedAchievements
