import { Typography, Box, IconButton } from "@mui/material"
import { formatDate, getRelativeTime } from "../utilities"
import BorderedImage from "./BorderedImage"
import ExternalLink from "./ExternalLink"
import { GameCompletionProgress } from "./GameCompletionProgress"
import Link from "./Link"
import { DateRangeTwoTone, TaskOutlined } from "@mui/icons-material"
import { useContext } from "react"
import PlayerSettingsContext from "../context/PlayerSettingsContext"

const HideUnlockedAchievementsButton = () => {
    const { hideUnlockedAchievements, setHideUnlockedAchievements } =
        useContext(PlayerSettingsContext)

    return (
        <IconButton
            title={hideUnlockedAchievements ? "Hide Unlocked" : "Show Unlocked"}
            color={hideUnlockedAchievements ? "inherit" : "primary"}
            onClick={() =>
                setHideUnlockedAchievements(!hideUnlockedAchievements)
            }
        >
            <TaskOutlined />
        </IconButton>
    )
}

const ChangeAchievementOrderButton = () => {
    const {
        achievementSortOrder,
        setAchievementSortOrder,
        hideUnlockedAchievements,
    } = useContext(PlayerSettingsContext)

    const orderByDifficulty = achievementSortOrder === "difficulty"

    return (
        <IconButton
            title={
                orderByDifficulty ? "Order by Difficulty" : "Order by Unlocked"
            }
            disabled={hideUnlockedAchievements}
            color={orderByDifficulty ? "inherit" : "primary"}
            onClick={() =>
                setAchievementSortOrder(
                    orderByDifficulty ? "unlocked" : "difficulty"
                )
            }
        >
            <DateRangeTwoTone />
        </IconButton>
    )
}

const OwnedGameLastPlayed = ({ lastPlayed }: { lastPlayed?: string }) => {
    return (
        lastPlayed && (
            <div>
                <Typography variant="subtitle1" textTransform="uppercase">
                    Last Played
                </Typography>
                <div title={formatDate(lastPlayed)}>
                    {getRelativeTime(lastPlayed)}
                </div>
            </div>
        )
    )
}

const OwnedGameWithAchievements = ({
    ownedGame,
}: {
    ownedGame: PlayerOwnedGame
}) => {
    const { game, lastPlayed, completed, unlockedAchievements } = ownedGame
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "space-evenly",
                    alignItems: "center",
                }}
            >
                <GameCompletionProgress
                    achievements={game.achievements ?? []}
                    playerAchievements={unlockedAchievements ?? []}
                />

                <OwnedGameLastPlayed lastPlayed={lastPlayed} />

                {completed && (
                    <div>
                        <Typography
                            variant="subtitle1"
                            textTransform="uppercase"
                        >
                            Completed
                        </Typography>
                        <div title={formatDate(completed)}>
                            {getRelativeTime(completed)}
                        </div>
                    </div>
                )}

                {game.difficultyPercentage !== undefined && (
                    <div>
                        <Typography
                            variant="subtitle1"
                            textTransform="uppercase"
                        >
                            Difficulty
                        </Typography>
                        {game.difficultyPercentage.toFixed(2)}%
                    </div>
                )}
            </div>
            <div style={{ flexGrow: 0 }}>
                <HideUnlockedAchievementsButton />
                <ChangeAchievementOrderButton />
            </div>
        </>
    )
}

const OwnedGameDetails = ({ ownedGame }: { ownedGame: PlayerOwnedGame }) => {
    const { game, lastPlayed } = ownedGame

    return (
        <div
            style={{
                display: "flex",
                flexGrow: 1,
            }}
        >
            {game.achievements && game.achievements?.length > 0 ? (
                <OwnedGameWithAchievements ownedGame={ownedGame} />
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexGrow: 1,
                        justifyContent: "space-evenly",
                        alignItems: "center",
                    }}
                >
                    <OwnedGameLastPlayed lastPlayed={lastPlayed} />
                </div>
            )}
        </div>
    )
}

const PlayerGameHeader = ({
    ownedGame,
}: {
    player: string
    ownedGame: PlayerOwnedGame
}) => {
    const { game } = ownedGame

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
                <OwnedGameDetails ownedGame={ownedGame} />
            </Box>
        </>
    )
}

export default PlayerGameHeader
