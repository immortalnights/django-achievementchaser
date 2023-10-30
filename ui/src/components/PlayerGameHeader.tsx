import { Typography, Box } from "@mui/material"
import { formatDate, getRelativeTime } from "../utilities"
import BorderedImage from "./BorderedImage"
import ExternalLink from "./ExternalLink"
import { GameCompletionProgress } from "./GameCompletionProgress"
import Link from "./Link"

interface OwnedGameDetailsProps extends OwnedGame {
    achievements: Achievement[]
    playerAchievements: RecentAchievement[]
}

const OwnedGameDetails = ({
    lastPlayed,
    difficultyPercentage,
    completed,
    achievements,
    playerAchievements,
}: OwnedGameDetailsProps) => {
    return (
        <div
            style={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "space-evenly",
                alignItems: "center",
            }}
        >
            {achievements.length > 0 && (
                <GameCompletionProgress
                    achievements={achievements}
                    playerAchievements={playerAchievements}
                />
            )}
            {lastPlayed && (
                <div>
                    <Typography variant="subtitle1" textTransform="uppercase">
                        Last Played
                    </Typography>
                    <div title={formatDate(lastPlayed)}>
                        {getRelativeTime(lastPlayed)}
                    </div>
                </div>
            )}
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
            {difficultyPercentage && difficultyPercentage !== 0.0 ? (
                <div>
                    <Typography variant="subtitle1" textTransform="uppercase">
                        Difficulty
                    </Typography>
                    {difficultyPercentage.toFixed(2)}%
                </div>
            ) : null}
        </div>
    )
}

const PlayerGameHeader = ({
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
                <Link to={`/Game/${game.id}`} variant="h5">
                    {game.name}
                </Link>
                <Box
                    sx={{
                        display: "flex",
                        paddingX: 1,
                        alignItems: "flex-end",
                    }}
                >
                    <ExternalLink
                        href={`http://store.steampowered.com/app/${game.id}`}
                        title="Steam Game"
                    />
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
                    difficultyPercentage={game.difficultyPercentage}
                    achievements={achievements}
                    playerAchievements={playerAchievements}
                />
            </Box>
        </>
    )
}

export default PlayerGameHeader
