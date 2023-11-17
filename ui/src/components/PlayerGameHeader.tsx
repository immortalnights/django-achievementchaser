import {
    Typography,
    Box,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material"
import { DateRangeTwoTone, TaskOutlined } from "@mui/icons-material"
import { useQuery } from "graphql-hooks"
import { formatDate, getRelativeTime } from "../utilities"
import BorderedImage from "./BorderedImage"
import ExternalLink from "./ExternalLink"
import { GameCompletionProgress } from "./GameCompletionProgress"
import Link from "./Link"
import { useContext } from "react"
import PlayerSettingsContext from "../context/PlayerSettingsContext"
import { players as playersDocument } from "../api/documents"

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

const PlayerSelect = ({ filter }: { filter: string[] }) => {
    const { data, loading, error } =
        useQuery<PlayersQueryResponse>(playersDocument)

    const handleChange = (event, child) => {
        console.log(child, event)
    }

    let players: Player[] = []
    if (data) {
        players = data.players.filter((player) => !filter.includes(player.id))
    }

    return (
        <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="select-player-compare-label">Compare</InputLabel>
            <Select
                labelId="select-player-compare-label"
                fullWidth
                value=""
                label="Compare"
                size="small"
                onChange={handleChange}
                disabled={loading}
            >
                {players.map((player) => (
                    <MenuItem key={player.id} value={player.id}>
                        {player.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

const OwnedGameWithAchievements = ({
    player,
    ownedGame,
}: {
    player: string
    ownedGame: PlayerOwnedGame
}) => {
    const { game, lastPlayed, completed, unlockedAchievements } = ownedGame

    return (
        <>
            <Box
                display="flex"
                flexGrow={1}
                justifyContent="space-evenly"
                alignItems="center"
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

                <div style={{ width: "200px" }}>
                    <PlayerSelect filter={[player]} />
                </div>
            </Box>
            <Box flexGrow={0}>
                <HideUnlockedAchievementsButton />
                <ChangeAchievementOrderButton />
            </Box>
        </>
    )
}

const OwnedGameDetails = ({
    player,
    ownedGame,
}: {
    player: string
    ownedGame: PlayerOwnedGame
}) => {
    const { game, lastPlayed } = ownedGame

    return (
        <div
            style={{
                display: "flex",
                flexGrow: 1,
            }}
        >
            {game.achievements && game.achievements?.length > 0 ? (
                <OwnedGameWithAchievements
                    player={player}
                    ownedGame={ownedGame}
                />
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
    player,
    ownedGame,
}: {
    player: string
    ownedGame: PlayerOwnedGame
}) => {
    const { game } = ownedGame

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    margin: 0,
                    alignItems: "flex-end",
                    gap: 1,
                }}
            >
                <Link to={`/Game/${game.id}`} variant="h5">
                    {game.name}
                </Link>
                <ExternalLink
                    href={`http://store.steampowered.com/app/${game.id}`}
                    title="Steam Game"
                />
            </Box>
            <Box sx={{ display: "flex" }}>
                <BorderedImage
                    src={`https://media.steampowered.com/steam/apps/${game.id}/capsule_184x69.jpg`}
                />
                <OwnedGameDetails player={player} ownedGame={ownedGame} />
            </Box>
        </>
    )
}

export default PlayerGameHeader
