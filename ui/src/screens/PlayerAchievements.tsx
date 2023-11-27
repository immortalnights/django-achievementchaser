import { Link, useParams, useRouteLoaderData } from "react-router-dom"
import { unwrapEdges } from "../api/utils"
import { Box, IconButton, Stack, Typography } from "@mui/material"
import { playerUnlockedAchievements } from "../api/documents"
import { useQuery } from "graphql-hooks"
import dayjs, { Dayjs } from "dayjs"
import { useMemo, useState } from "react"
import UnlockedAchievementIcon from "../components/UnlockedAchievementIcon"
import { formatDate } from "../dayjsUtilities"
import { NavigateBefore, NavigateNext } from "@mui/icons-material"
import NoAchievementsBanner from "../components/NoAchievementsBanner"

const getToDate = (date?: string) => {
    const now = dayjs()
    const parsedDate = date ? dayjs(date, "DD-MM-YYYY") : undefined
    let toDate

    if (parsedDate && parsedDate.isValid()) {
        const twoWeeksLater = parsedDate.add(2, "weeks")
        if (twoWeeksLater.isAfter(now)) {
            toDate = now
        } else {
            toDate = twoWeeksLater
        }
    } else {
        toDate = now
    }

    return toDate
}

const AchievementsOnWeek = ({
    player,
    week,
    achievements,
}: {
    player: string
    week: number
    achievements: PlayerUnlockedAchievement[]
}) => {
    const startOfWeek = dayjs().week(week)
    const endOfWeek = startOfWeek.add(6, "days")

    return (
        <>
            <h3>{`${formatDate(startOfWeek)} to ${formatDate(endOfWeek)}`}</h3>
            <Stack direction="row" flexWrap="wrap" gap={1.05}>
                {achievements.map((item) => (
                    <UnlockedAchievementIcon
                        key={`${item.id}`}
                        player={player}
                        unlockedAchievement={item}
                        size="md"
                    />
                ))}
            </Stack>
        </>
    )
}

const WeeklyAchievements = ({
    player,
    achievements,
}: {
    player: string
    achievements: PlayerUnlockedAchievement[]
}) => {
    const weeklyAchievements = useMemo(() => {
        const grouped: {
            [key: number]: PlayerUnlockedAchievement[]
        } = {}

        achievements.forEach((achievement) => {
            const week = dayjs(achievement.datetime).week()

            if (!grouped[week]) {
                grouped[week] = []
            }

            grouped[week].push(achievement)
        })

        return grouped
    }, [achievements])

    return (
        <Box flexGrow={1} minHeight={10}>
            {Object.entries(weeklyAchievements).map(([week, achievements]) => (
                <AchievementsOnWeek
                    key={`week-${week}`}
                    player={player}
                    week={Number(week)}
                    achievements={achievements}
                />
            ))}
        </Box>
    )
}

const PlayerUnlockedAchievements = ({
    player,
    achievements,
    fromDate,
    toDate,
}: {
    player: string
    achievements: PlayerUnlockedAchievement[]
    fromDate: Dayjs
    toDate: Dayjs
}) => {
    return (
        <Box display="flex" gap={2}>
            <IconButton
                component={Link}
                to={`/Player/${player}/Achievements/${fromDate.format(
                    "DD-MM-YYYY"
                )}`}
            >
                <NavigateBefore />
            </IconButton>
            {achievements.length > 0 ? (
                <WeeklyAchievements
                    player={player}
                    achievements={achievements}
                />
            ) : (
                <NoAchievementsBanner
                    title={`No Achievements from ${fromDate.format(
                        "DD-MM-YYYY"
                    )} to ${toDate.format("DD-MM-YYYY")}`}
                />
            )}
            <IconButton
                component={Link}
                to={`/Player/${player}/Achievements/${toDate.format(
                    "DD-MM-YYYY"
                )}`}
            >
                <NavigateNext />
            </IconButton>
        </Box>
    )
}

const PlayerAchievements = () => {
    const player = useRouteLoaderData("player") as Player
    const { date } = useParams()
    dayjs.tz.setDefault(dayjs.tz.guess())
    const toDate = getToDate(date)
    const fromDate = toDate.subtract(4, "weeks")
    // console.debug(
    //     `${fromDate.format("DD-MM-YYYY")} -(${date})> ${toDate.format(
    //         "DD-MM-YYYY"
    //     )}`
    // )

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

    const [cache, setCache] = useState<PlayerUnlockedAchievement[]>([])

    useMemo(() => {
        if (!loading) {
            setCache(unwrapEdges(data?.player?.unlockedAchievements) ?? [])
        }
    }, [loading, data])

    return (
        <>
            <Typography variant="h5">Achievements</Typography>
            <PlayerUnlockedAchievements
                player={player.id}
                achievements={cache}
                fromDate={fromDate}
                toDate={toDate}
            />
        </>
    )
}

export default PlayerAchievements
