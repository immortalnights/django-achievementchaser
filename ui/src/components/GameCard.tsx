import { Typography, Tooltip } from "@mui/material"
import dayjs from "dayjs"
import { useMemo } from "react"
import { getRelativeTime, formatDate } from "../utilities"
import BorderedImage from "./BorderedImage"
import Link from "./Link"

const GameCard = ({
    player,
    game,
    lastPlayed,
    completed,
    unlockedAchievements,
}: {
    player: string
    game: Game
    lastPlayed?: string
    completed?: string
    unlockedAchievements?: number
}) => {
    let completionTitle: string | undefined

    if (completed) {
        const completionDate = dayjs(completed)

        completionTitle = `Completed: ${formatDate(
            completionDate
        )} (${getRelativeTime(completionDate)})`
    } else if (game.achievementCount && unlockedAchievements) {
        const percentage = (unlockedAchievements / game.achievementCount) * 100

        completionTitle = `Progress: ${unlockedAchievements} of ${
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
    if (lastPlayed) {
        lastPlayedTitle = `Last Played: ${formatDate(
            lastPlayed
        )} (${getRelativeTime(lastPlayed)})`
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
        [name, completionTitle, lastPlayedTitle, difficultyPercentageTitle]
    )

    return (
        <Link to={`/Player/${player}/Game/${game.id}`}>
            <Tooltip title={titleEl} arrow enterDelay={500} leaveDelay={0}>
                <BorderedImage
                    alt={game.name}
                    src={`https://media.steampowered.com/steam/apps/${game.id}/capsule_184x69.jpg`}
                />
            </Tooltip>
        </Link>
    )
}

export default GameCard
