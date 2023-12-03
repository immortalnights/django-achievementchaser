import { Typography } from "@mui/material"
import dayjs from "dayjs"
import { useMemo } from "react"
import { getRelativeTime, formatDate } from "@/dayjsUtilities"
import Link from "./Link"
import { GameIconWithTooltip } from "./GameIcon"

const GameCard = ({
    player,
    game,
    lastPlayed,
    completed,
    unlockedAchievementCount,
}: {
    player: string
    game: Game
    lastPlayed?: string
    completed?: string
    unlockedAchievementCount?: number
}) => {
    let completionTitle: string | undefined

    if (completed) {
        const completionDate = dayjs(completed)

        completionTitle = `Completed: ${formatDate(
            completionDate
        )} (${getRelativeTime(completionDate)})`
    } else if (game.achievementCount && unlockedAchievementCount) {
        const percentage =
            (unlockedAchievementCount / game.achievementCount) * 100

        completionTitle = `Progress: ${unlockedAchievementCount} of ${
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
        [game.name, completionTitle, lastPlayedTitle, difficultyPercentageTitle]
    )

    return (
        <Link to={`/Player/${player}/Game/${game.id}`}>
            <GameIconWithTooltip game={game} tooltip={titleEl} />
        </Link>
    )
}

export default GameCard
