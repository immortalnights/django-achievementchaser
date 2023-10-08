import { styled, Typography, Tooltip } from "@mui/material"
import dayjs from "dayjs"
import { useMemo } from "react"
import { Link } from "react-router-dom"
import { getRelativeTime, formatDate } from "../utilities"
import BorderedImage from "./BorderedImage"

const ReactiveLink = styled(Link)``

const OwnedGame = ({ player, game }: { player: string; game: OwnedGame }) => {
    let title = `${game.name}`

    let completionTitle: string | undefined
    if (game.completed) {
        const completionDate = dayjs(game.completed)
        completionTitle = `Completed: ${completionDate.format(
            "MMM D, YYYY"
        )} (${getRelativeTime(completionDate)})`
    } else if (game.completionPercentage) {
        completionTitle = `Progress: ${(
            game.completionPercentage * 100
        ).toFixed(2)}%`
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
        [completionTitle, lastPlayedTitle, difficultyPercentageTitle]
    )

    return (
        <ReactiveLink to={`/Player/${player}/Game/${game.id}`}>
            <Tooltip title={titleEl} arrow enterDelay={500} leaveDelay={0}>
                <BorderedImage
                    src={`https://media.steampowered.com/steam/apps/${game.id}/capsule_184x69.jpg`}
                    title={title}
                />
            </Tooltip>
        </ReactiveLink>
    )
}

export default OwnedGame
