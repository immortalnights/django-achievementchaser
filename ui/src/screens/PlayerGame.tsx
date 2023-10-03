import { useParams } from "react-router-dom"
import { request, gql } from "graphql-request"
import { useEffect, useState } from "react"
import { Box, Link as ExternalLink, Typography } from "@mui/material"
import Loader from "../components/Loader"
import { useQueryPlayerGame } from "../api/queries"
import { formatDate, getRelativeTime, throwExpression } from "../utilities"
import { OpenInNew } from "@mui/icons-material"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import BorderedImage from "../components/BorderedImage"
import CircularProgressWithLabel from "../components/CircularProgressWithLabel"

interface OwnedGameDetailsProps extends OwnedGame {
    achievements: Achievement[]
    playerAchievements: RecentAchievement[]
}

const OwnedGameDetails = ({
    lastPlayed,
    completed,
    achievements,
    playerAchievements,
}: OwnedGameDetailsProps) => {
    const min = achievements.reduce<number | undefined>(
        (min, achievement) =>
            achievement.globalPercentage !== undefined
                ? min && min < achievement.globalPercentage
                    ? min
                    : achievement.globalPercentage
                : 0,
        0
    )
    const max = achievements.reduce(
        (max, achievement) =>
            achievement.globalPercentage !== undefined
                ? max < achievement.globalPercentage
                    ? achievement.globalPercentage
                    : max
                : 0,
        0
    )
    return (
        <div
            style={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "space-evenly",
                alignItems: "center",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ margin: "8px 0 0" }}>
                    <CircularProgressWithLabel
                        value={
                            (playerAchievements.length / achievements.length) *
                            100
                        }
                    />
                </div>
                <div>
                    <Typography variant="subtitle1" textTransform="uppercase">
                        Achievements
                    </Typography>
                    <div>
                        {playerAchievements.length} of {achievements.length}
                    </div>
                </div>
            </div>
            <div>
                <Typography variant="subtitle1" textTransform="uppercase">
                    Last Played
                </Typography>
                <div title={formatDate(lastPlayed)}>
                    {getRelativeTime(lastPlayed)}
                </div>
            </div>
            {completed && (
                <div>
                    <Typography variant="subtitle1" textTransform="uppercase">
                        Completed
                    </Typography>
                    <div title={formatDate(completed)}>
                        {getRelativeTime(completed)}
                    </div>
                </div>
            )}
            <div>
                <Typography variant="subtitle1" textTransform="uppercase">
                    Difficulty
                </Typography>
                {min?.toFixed(2)}% to {max.toFixed(2)}%
            </div>
        </div>
    )
}

interface MaybeUnlockedAchievement extends Achievement {
    unlocked?: string
}

const AchievementItem = ({
    displayName,
    description,
    iconUrl,
    iconGrayUrl,
    globalPercentage,
    unlocked,
}: MaybeUnlockedAchievement) => {
    const startGradient = Math.floor(globalPercentage ?? 0)
    const endGradient = 100 - startGradient

    return (
        <li style={{ display: "flex", margin: "0.25em" }}>
            <img
                src={unlocked ? iconUrl : iconGrayUrl}
                style={{ width: 64, height: 64 }}
            />
            <div
                style={{
                    flexGrow: 1,
                    marginLeft: "0.5em",
                }}
            >
                <div
                    style={{
                        border: "1px solid darkgray",
                        borderRadius: 2,
                        padding: 2,
                    }}
                >
                    <div
                        style={{
                            flexGrow: 1,
                            display: "flex",
                            background: `linear-gradient(to right, #ccc ${startGradient}%, transparent ${
                                100 - endGradient
                            }%)`,
                        }}
                    >
                        <div
                            style={{
                                padding: "0.1em 0 0.1em 0.5em",
                                flexGrow: 1,
                            }}
                        >
                            <Typography variant="h6">{displayName}</Typography>
                            <Typography>{description}</Typography>
                        </div>
                        {unlocked && (
                            <Box
                                sx={{ margin: "auto 0.5em", minWidth: "10em" }}
                            >
                                <Typography>{`Unlocked ${getRelativeTime(
                                    unlocked
                                )}`}</Typography>
                                <Typography fontSize="small">
                                    {formatDate(unlocked)}
                                </Typography>
                            </Box>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ margin: "auto 0.5em" }}>
                {globalPercentage?.toFixed(2)}%
            </div>
        </li>
    )
}

const GameDetails = ({
    player,
    game,
    achievements,
    playerGame,
    playerAchievements,
}: {
    player: string
    game: Game
    achievements: Achievement[]
    playerGame: OwnedGame
    playerAchievements: RecentAchievement[]
}) => {
    return (
        <>
            <Box sx={{ display: "flex", margin: 0 }}>
                <ExternalLink
                    component={Link}
                    to={`/Game/${game.id}`}
                    variant="h5"
                    underline="none"
                >
                    {game.name}
                </ExternalLink>
                <Box
                    sx={{
                        display: "flex",
                        paddingX: 1,
                        alignItems: "flex-end",
                    }}
                >
                    <ExternalLink
                        href={`http://store.steampowered.com/app/${game.id}`}
                        target="_blank"
                        title="Steam Game"
                        rel="noopener"
                    >
                        <OpenInNew fontSize="small" />
                    </ExternalLink>
                </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
                <div>
                    <BorderedImage
                        src={`https://media.steampowered.com/steam/apps/${game.id}/capsule_184x69.jpg`}
                    />
                </div>
                <OwnedGameDetails
                    {...playerGame}
                    achievements={achievements}
                    playerAchievements={playerAchievements}
                />
            </Box>
            <ul
                style={{
                    listStyle: "none",
                    padding: "0 0 2em",
                    margin: "0.5em 0 0",
                }}
            >
                {achievements.map((achievement) => {
                    const playerAchievement = playerAchievements.find(
                        (value) => value.id === achievement.name
                    )

                    return (
                        <AchievementItem
                            key={achievement.name}
                            {...achievement}
                            unlocked={playerAchievement?.unlocked}
                        />
                    )
                })}
            </ul>
        </>
    )
}

const PlayerGameContainer = () => {
    const { id: player = throwExpression("Missing 'player' parameter") } =
        useParams()
    const { gameId: game = throwExpression("Missing 'game' parameter") } =
        useParams()
    const { loading, error, data } = useQueryPlayerGame({
        player,
        game,
    })
    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return <GameDetails player={player} {...data} />
            }}
        />
    )
}

export default PlayerGameContainer
