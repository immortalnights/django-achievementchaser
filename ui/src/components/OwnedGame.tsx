import { Typography, Tooltip } from "@mui/material"
import dayjs from "dayjs"
import { useMemo } from "react"
import { getRelativeTime, formatDate } from "../utilities"
import BorderedImage from "./BorderedImage"
import Link from "./Link"

const OwnedGame = ({ player, game }: { player: string; game: OwnedGame }) => {
    let completionTitle: string | undefined

    if (game.completed) {
        const completionDate = dayjs(game.completed)

        completionTitle = `Completed: ${completionDate.format(
            "MMM D, YYYY"
        )} (${getRelativeTime(completionDate)})`
    } else if (game.achievementCount && game.unlockedAchievementCount) {
        const percentage =
            (game.unlockedAchievementCount / game.achievementCount) * 100

        completionTitle = `Progress: ${game.unlockedAchievementCount} / ${
            game.achievementCount
        } (${percentage.toFixed(2)}%)`
    } else if (game.achievementCount) {
        completionTitle = `Achievements: ${game.achievementCount}`
    }

    let difficultyPercentageTitle: string | undefined
    if (game.difficultyPercentage) {
        difficultyPercentageTitle = `Difficulty: ${game.difficultyPercentage.toFixed(
            2
        )}%`
    }

    let lastPlayedTitle: string | undefined
    if (game.lastPlayed) {
        lastPlayedTitle = `Last Played: ${formatDate(game.lastPlayed)}`
    }

    const titleEl = useMemo(
        () => (
            <>
                <Typography>{game.name}</Typography>
                {completionTitle && (
                    <Typography fontSize="small">{completionTitle}</Typography>
                )}
                {lastPlayedTitle && (
                    <Typography fontSize="small">{lastPlayedTitle}</Typography>
                )}
                {difficultyPercentageTitle && (
                    <Typography fontSize="small">
                        {difficultyPercentageTitle}
                    </Typography>
                )}
            </>
        ),
        [game.name, completionTitle, lastPlayedTitle, difficultyPercentageTitle]
    )

    return (
        <Link to={`/Player/${player}/Game/${game.id}`}>
            <Tooltip title={titleEl} arrow enterDelay={500} leaveDelay={0}>
                <BorderedImage
                    src={`https://media.steampowered.com/steam/apps/${game.id}/capsule_184x69.jpg`}
                />
            </Tooltip>
        </Link>
    )
}

export default OwnedGame
