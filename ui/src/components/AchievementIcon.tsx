import { Typography, Tooltip } from "@mui/material"
import dayjs from "dayjs"
import { getRelativeTime } from "../dayjsUtilities"
import BorderedImage from "./BorderedImage"

const AchievementTitle = ({
    achievement,
    unlockedDatetime,
}: {
    achievement: Achievement
    unlockedDatetime?: string
}) => {
    let subTitle: string | undefined
    if (unlockedDatetime) {
        const unlockedDate = dayjs(unlockedDatetime)
        subTitle = `Unlocked: ${unlockedDate.format(
            "MMM D, YYYY"
        )} (${getRelativeTime(unlockedDate)})`
    } else if (achievement.globalPercentage) {
        subTitle = `Difficulty: ${achievement.globalPercentage.toFixed(2)}%`
    }

    return (
        <>
            <Typography>{achievement.displayName}</Typography>
            {subTitle && <Typography fontSize="small">{subTitle}</Typography>}
        </>
    )
}

const AchievementIcon = ({
    achievement,
    unlockedDatetime,
}: {
    game: string
    achievement: Achievement
    unlockedDatetime?: string
}) => {
    const getAchievementIcon = (unlocked: boolean, achievement: Achievement) =>
        unlocked ? achievement.iconUrl : achievement.iconGrayUrl

    return (
        <Tooltip
            title={
                <AchievementTitle
                    achievement={achievement}
                    unlockedDatetime={unlockedDatetime}
                />
            }
            arrow
        >
            <div>
                <BorderedImage
                    src={getAchievementIcon(!!unlockedDatetime, achievement)}
                    style={{
                        width: 64,
                        height: 64,
                    }}
                />
            </div>
        </Tooltip>
    )
}

export default AchievementIcon
