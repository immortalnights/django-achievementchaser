import { Typography, Tooltip } from "@mui/material"
import dayjs from "dayjs"
import { useMemo } from "react"
import { getRelativeTime, formatDate } from "../dayjsUtilities"
import Link from "./Link"
import GameIcon from "./GameIcon"

const GameCapsule = ({
    player,
    game,
    ownedGame,
}: {
    player: string
    game: Game
    ownedGame?: Omit<PlayerOwnedGame, "game">
}) => {
    let completionTitle: string | undefined

    if (ownedGame && ownedGame.completed) {
        const completionDate = dayjs(ownedGame.completed)

        completionTitle = `Completed: ${completionDate.format(
            "MMM D, YYYY"
        )} (${getRelativeTime(completionDate)})`
    } else if (
        game.achievementCount &&
        ownedGame &&
        ownedGame.unlockedAchievementCount
    ) {
        const percentage =
            (ownedGame.unlockedAchievementCount / game.achievementCount) * 100

        completionTitle = `Progress: ${ownedGame.unlockedAchievementCount} / ${
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
    if (ownedGame && ownedGame.lastPlayed) {
        lastPlayedTitle = `Last Played: ${formatDate(ownedGame.lastPlayed)}`
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
                <GameIcon {...game} />
            </Tooltip>
        </Link>
    )
}

export default GameCapsule
