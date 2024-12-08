import { Tooltip, Typography } from "@mui/material"
import { useMemo } from "react"
import { getRelativeTime } from "@/dayjsUtilities"
import Link from "./Link"
import BorderedImage from "./BorderedImage"

const UnlockedAchievementIcon = ({
    player,
    unlockedAchievement,
    size = "sm",
}: {
    player: string
    unlockedAchievement: PlayerUnlockedAchievement
    size?: "sm" | "md"
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

    let widthHeight
    switch (size) {
        case "sm": {
            widthHeight = 32
            break
        }
        case "md": {
            widthHeight = 64
            break
        }
    }

    return (
        <Link to={`/Player/${player}/Game/${unlockedAchievement.game.id}`}>
            <Tooltip title={title} arrow enterDelay={500} leaveDelay={0}>
                <BorderedImage
                    src={unlockedAchievement.achievement.iconUrl}
                    style={{
                        width: widthHeight,
                        height: widthHeight,
                        display: "block",
                    }}
                />
            </Tooltip>
        </Link>
    )
}

export default UnlockedAchievementIcon
