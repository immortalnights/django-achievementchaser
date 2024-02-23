import { Tooltip, Typography } from "@mui/material"
import dayjs from "dayjs"
import { ReactNode, forwardRef } from "react"
import { getRelativeTime, formatDate } from "@/dayjsUtilities"
import Link from "../Link"
import GameIcon from "../GameIcon"

export const GameIconWithTooltip = ({
    game,
    tooltip,
}: {
    game: Game
    tooltip: ReactNode
}) => {
    const Wrapped = forwardRef((props, ref) => (
        <GameIcon {...game} {...props} innerRef={ref} />
    ))

    return (
        <Tooltip title={tooltip} arrow enterDelay={500} leaveDelay={0}>
            <Wrapped />
        </Tooltip>
    )
}

const TooltipContent = ({
    game,
    ownedGame,
}: {
    game: Game
    ownedGame?: Omit<PlayerOwnedGame, "game">
}) => {
    let completionTitle: string | undefined
    let lastPlayedTitle: string | undefined

    if (ownedGame) {
        if (ownedGame.completed) {
            const completionDate = dayjs(ownedGame.completed)

            completionTitle = `Completed: ${formatDate(
                completionDate
            )} (${getRelativeTime(completionDate)})`
        } else if (
            game.achievementCount &&
            ownedGame.unlockedAchievementCount
        ) {
            const percentage =
                (ownedGame.unlockedAchievementCount / game.achievementCount) *
                100

            completionTitle = `Progress: ${
                ownedGame.unlockedAchievementCount
            } of ${game.achievementCount} (${percentage.toFixed(2)}%)`
        }

        if (ownedGame.lastPlayed) {
            lastPlayedTitle = `Last Played: ${formatDate(
                ownedGame.lastPlayed
            )} (${getRelativeTime(ownedGame.lastPlayed)})`
        }
    } else if (game.achievementCount) {
        completionTitle = `Achievements: ${game.achievementCount}`
    }

    let difficultyPercentageTitle: string | undefined
    if (game.difficultyPercentage) {
        difficultyPercentageTitle = `Difficulty: ${game.difficultyPercentage.toFixed(
            2
        )}%`
    }

    return (
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
    )
}

const GameCapsule = ({
    player,
    game,
    ownedGame,
}: {
    game: Game
    player?: string
    ownedGame?: Omit<PlayerOwnedGame, "game">
}) => {
    const linkTo = player
        ? `/Player/${player}/Game/${game.id}`
        : `/Game/${game.id}`

    return (
        <Link to={linkTo}>
            <GameIconWithTooltip
                game={game}
                tooltip={<TooltipContent game={game} ownedGame={ownedGame} />}
            />
        </Link>
    )
}

export default GameCapsule
