import { Link, useParams, useRouteLoaderData } from "react-router-dom"
import { unwrapEdges } from "@/api/utils"
import { Alert, Box, IconButton, Stack, Typography } from "@mui/material"
import { playerPerfectGames, playerUnlockedAchievements } from "@/api/documents"
import { useQuery } from "graphql-hooks"
import dayjs, { Dayjs } from "dayjs"
import { useMemo, useState } from "react"
import UnlockedAchievementIcon from "@/components/UnlockedAchievementIcon"
import { NavigateBefore, NavigateNext } from "@mui/icons-material"
import GameCapsule from "@/components/GameCapsule"

const UnlockedAchievements = ({
    player,
    achievements,
}: {
    player: string
    achievements: PlayerUnlockedAchievement[]
}) => (
    <>
        {achievements.length > 0 ? (
            achievements.map((item) => (
                <UnlockedAchievementIcon
                    key={item.id}
                    player={player}
                    unlockedAchievement={item}
                    size="md"
                />
            ))
        ) : (
            <div
                style={{
                    backgroundColor: "lightgray",
                    textAlign: "center",
                    padding: 4,
                }}
            >
                None
            </div>
        )}
    </>
)

const PerfectGames = ({
    player,
    games,
}: {
    player: string
    games: PlayerOwnedGameWithGame[]
}) => {
    return (
        <>
            {games.map((ownedGame) => (
                <GameCapsule
                    key={ownedGame.game.id}
                    player={player}
                    game={ownedGame.game}
                    ownedGame={ownedGame}
                />
            ))}
        </>
    )
}

const DailyAchievements = ({
    player,
    fromDate,
    toDate,
    achievements,
    perfectGames,
}: {
    player: string
    fromDate: Dayjs
    toDate: Dayjs
    achievements: PlayerUnlockedAchievement[]
    perfectGames: PlayerOwnedGameWithGame[]
}) => {
    const groups = useMemo(() => {
        const dates = Array(Math.abs(fromDate.diff(toDate, "days")) + 1)
            .fill(0)
            .map((_, i) => fromDate.add(i, "days").format("YYYY-MM-DD"))

        interface GroupedAchievements {
            [key: string]: {
                achievements: PlayerUnlockedAchievement[]
                perfectGames: PlayerOwnedGameWithGame[]
            }
        }

        const groups = dates.reduce<GroupedAchievements>(
            (previousValue, currentValue) => {
                previousValue[currentValue] = {
                    achievements: [],
                    perfectGames: [],
                }

                return previousValue
            },
            {}
        )

        achievements.forEach((achievement) => {
            const key = dayjs(achievement.datetime).format("YYYY-MM-DD")
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (groups[key]) {
                groups[key].achievements.push(achievement)
            }
        })

        perfectGames.forEach((ownedGame) => {
            const key = dayjs(ownedGame.completed).format("YYYY-MM-DD")
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (groups[key]) {
                groups[key].perfectGames.push(ownedGame)
            }
        })

        return groups
    }, [fromDate, toDate, achievements, perfectGames])

    return (
        <Box display="flex" justifyContent="space-between" flexGrow={1}>
            {Object.entries(groups).map(
                ([date, { achievements, perfectGames }]) => (
                    <Box key={date}>
                        <Box textAlign="center">
                            {dayjs(date).format("MMM Do")}
                        </Box>
                        <Stack
                            direction="column"
                            flexWrap="wrap"
                            gap={1.05}
                            alignItems="center"
                        >
                            <UnlockedAchievements
                                player={player}
                                achievements={achievements}
                            />
                            <PerfectGames
                                player={player}
                                games={perfectGames}
                            />
                        </Stack>
                    </Box>
                )
            )}
        </Box>
    )
}

const PlayerUnlockedAchievements = ({
    player,
    achievements,
    perfectGames,
    selectedDate,
    fromDate,
    toDate,
}: {
    player: string
    achievements: PlayerUnlockedAchievement[]
    perfectGames: PlayerOwnedGameWithGame[]
    selectedDate: Dayjs
    fromDate: Dayjs
    toDate: Dayjs
}) => {
    return (
        <Box display="flex" gap={2}>
            <IconButton
                component={Link}
                to={`/Player/${player}/Achievements/${selectedDate
                    .subtract(1, "week")
                    .format("DD-MM-YYYY")}`}
                sx={{ maxHeight: 32 }}
            >
                <NavigateBefore />
            </IconButton>

            {achievements.length > 0 ? (
                <DailyAchievements
                    player={player}
                    fromDate={fromDate}
                    toDate={toDate}
                    achievements={achievements}
                    perfectGames={perfectGames}
                />
            ) : (
                <Box flexGrow={1}>
                    <Alert severity="info">No Achievements</Alert>
                </Box>
            )}

            <IconButton
                component={Link}
                to={`/Player/${player}/Achievements/${toDate
                    .add(1, "week")
                    .format("DD-MM-YYYY")}`}
                sx={{ maxHeight: 32 }}
            >
                <NavigateNext />
            </IconButton>
        </Box>
    )
}

const PlayerAchievements = () => {
    const player = useRouteLoaderData("player") as Player
    const { date } = useParams()
    const selectedDate = date ? dayjs(date, "DD-MM-YYYY") : dayjs()
    const fromDate = selectedDate.startOf("week")
    const toDate = selectedDate.endOf("week")

    // console.debug(
    //     `${fromDate.format("DD-MM-YYYY")} -(${date})> ${toDate.format(
    //         "DD-MM-YYYY"
    //     )}`
    // )

    document.title = `${player.name} · Achievements · Achievement Chaser`

    const { loading, data } = useQuery<PlayerQueryResponse>(
        playerUnlockedAchievements,
        {
            variables: {
                player: player.id,
                range: [
                    fromDate.format("YYYY-MM-DDT00:00:00Z"),
                    toDate.format("YYYY-MM-DDT23:59:59Z"),
                ],
                orderBy: "-datetime",
            },
        }
    )

    const { data: perfectGames } = useQuery<PlayerQueryResponse>(
        playerPerfectGames,
        {
            variables: {
                player: player.id,
                range: [
                    fromDate.format("YYYY-MM-DDT00:00:00Z"),
                    toDate.format("YYYY-MM-DDT23:59:59Z"),
                ],
                orderBy: "-completed",
            },
        }
    )

    const [cache, setCache] = useState<PlayerUnlockedAchievement[]>([])

    useMemo(() => {
        if (!loading) {
            setCache(unwrapEdges(data?.player?.unlockedAchievements))
        }
    }, [loading, data])

    return (
        <>
            <Typography variant="h5">
                {`Achievements ${fromDate.format(
                    "Do MMMM YYYY"
                )} to ${toDate.format("Do MMMM YYYY")}`}
            </Typography>
            <PlayerUnlockedAchievements
                player={player.id}
                achievements={cache}
                perfectGames={
                    perfectGames ? unwrapEdges(perfectGames.player?.games) : []
                }
                selectedDate={selectedDate}
                fromDate={fromDate}
                toDate={toDate}
            />
        </>
    )
}

export default PlayerAchievements
