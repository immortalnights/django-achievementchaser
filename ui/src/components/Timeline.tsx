import { ChangeEvent, useMemo, useCallback, useState, useEffect } from "react"
import dayjs from "dayjs"
import { Box, InputLabel, NativeSelect } from "@mui/material"
import { unwrapEdges, updateUnlockedAchievementData } from "../api/utils"
import { formatDate } from "../dayjsUtilities"
import {
    VideogameAssetTwoTone,
    WorkspacePremiumTwoTone,
} from "@mui/icons-material"
import { useQuery } from "graphql-hooks"
import { playerGames, playerUnlockedAchievements } from "../api/documents"
import { useNavigate } from "react-router-dom"

const YearSelector = ({
    selected,
    onChange,
}: {
    selected: number
    onChange: (year: number) => void
}) => {
    const startYear = 2008
    const endYear = dayjs().year()

    const years = [...Array(endYear - startYear + 1).keys()].map(
        (index) => startYear + index
    )

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange(Number(e.target.value))
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
            }}
        >
            <InputLabel
                variant="standard"
                htmlFor="year-select"
                style={{ marginRight: 10 }}
            >
                Year
            </InputLabel>
            <NativeSelect
                defaultValue={selected.toFixed(0)}
                onChange={handleChange}
                inputProps={{
                    name: "year",
                    id: "year-select",
                }}
            >
                {years.map((year) => (
                    <option key={year} value={year.toFixed(0)}>
                        {year}
                    </option>
                ))}
            </NativeSelect>
        </div>
    )
}

const CalendarHeader = ({
    year,
    onChangeYear,
    totalPerfectGames = 0,
    totalUnlockedAchievements = 0,
}: {
    year: number
    onChangeYear: (value: number) => void
    totalPerfectGames?: number
    totalUnlockedAchievements?: number
}) => {
    return (
        <Box
            display="flex"
            sx={{ userSelect: "none", justifyContent: "space-between" }}
        >
            <div style={{ marginLeft: 5, flexGrow: 0.4 }}>Jan</div>

            <YearSelector
                selected={year}
                onChange={(year) => onChangeYear(year)}
            />
            <Box
                display="flex"
                alignItems="center"
                marginX={2}
                title="Perfect Games"
                minWidth={60}
            >
                <VideogameAssetTwoTone sx={{ marginRight: "4px" }} />
                {totalPerfectGames.toFixed(0).padStart(2, "0") || "00"}
            </Box>
            <Box
                display="flex"
                alignItems="center"
                marginX={2}
                title="Unlocked Achievements"
                minWidth={60}
            >
                <WorkspacePremiumTwoTone />
                {totalUnlockedAchievements.toFixed(0).padStart(2, "0") || "00"}
            </Box>
            <div style={{ marginRight: 10, textAlign: "right", flexGrow: 0.4 }}>
                Dec
            </div>
        </Box>
    )
}

const Calendar = ({
    player,
    year,
    perfectGames,
    achievements,
}: {
    player: string
    year: number
    perfectGames: PlayerOwnedGame[]
    achievements: PlayerUnlockedAchievement[]
}) => {
    const navigate = useNavigate()
    const yearDate = dayjs(`01-01-${year}`)

    // Make all achievements have a dayjs object
    const unlockedAchievementIndex = useMemo(() => {
        const index: { [key: string]: number } = {}
        achievements.forEach((achievement) => {
            const date = dayjs(achievement.datetime).format("DD-MM-YYYY")
            if (!index[date]) {
                index[date] = 0
            }

            index[date] += 1
        })

        return index
    }, [achievements])

    const perfectGamesIndex = useMemo(() => {
        const index: { [key: string]: number } = {}
        perfectGames.forEach((game) => {
            const date = dayjs(game.completed).format("DD-MM-YYYY")
            if (!index[date]) {
                index[date] = 0
            }

            index[date] += 1
        })

        return index
    }, [perfectGames])

    const getPerfectGameCount = useCallback(
        (date: string) => perfectGamesIndex[date] ?? 0,
        [perfectGamesIndex]
    )

    const getAchievementCount = useCallback(
        (date: string) => unlockedAchievementIndex[date] ?? 0,
        [unlockedAchievementIndex]
    )

    const handleClickTimelineDay = useCallback((date: string) => {
        navigate(`/Player/${player}/Achievements/${date}`)
    }, [])

    const calendar = useMemo(() => {
        // console.time("Building calendar")
        const startOfTimeline = yearDate.startOf("year")
        const endOfTimeline = yearDate.endOf("year")
        const totalDays = endOfTimeline.diff(startOfTimeline, "days")

        const calendar: { [key: number]: React.JSX.Element[] } = {
            0: [], // sunday
            1: [], // monday
            2: [], // tuesday
            3: [], // wednesday
            4: [], // thursday
            5: [], // friday
            6: [], // saturday
        }

        let currentDate = dayjs(startOfTimeline)
        let day = Number(currentDate.format("d"))

        for (let index = 0; index < day; index++) {
            calendar[index].push(<td key={day + index}></td>)
        }

        for (let index = 0; index <= totalDays; index++) {
            const dateString = currentDate.format("DD-MM-YYYY")
            const displayDate = formatDate(currentDate)
            const perfectGameCount = getPerfectGameCount(dateString)
            const achievementCount = getAchievementCount(dateString)

            let perfectGameClassName
            if (perfectGameCount > 0) {
                perfectGameClassName = "perfect"
            }

            let colorClassName = "none"
            if (achievementCount > 0 && achievementCount < 6) {
                colorClassName = "low"
            } else if (achievementCount >= 6 && achievementCount < 20) {
                colorClassName = "med"
            } else if (achievementCount > 20) {
                colorClassName = "high"
            }

            let title
            if (perfectGameCount > 0 && achievementCount > 0) {
                title = `${perfectGameCount} perfect games and ${achievementCount} achievements on ${displayDate}`
            } else if (achievementCount > 0) {
                title = `${achievementCount} achievements on ${displayDate}`
            } else {
                title = `No achievements on ${displayDate}`
            }

            calendar[day].push(
                <td
                    key={dateString}
                    className={[
                        "day",
                        colorClassName,
                        perfectGameClassName,
                        "light",
                        achievementCount > 0 ? "selectable" : "",
                    ].join(" ")}
                    title={title}
                    onClick={() =>
                        achievementCount > 0 &&
                        handleClickTimelineDay(dateString)
                    }
                >
                    <span className="sr-only">{displayDate}</span>
                </td>
            )

            currentDate = currentDate.add(1, "day")
            day = Number(currentDate.format("d"))
        }

        // console.timeEnd("Building calendar")
        return calendar
    }, [getPerfectGameCount, getAchievementCount, yearDate])

    return (
        <table className="">
            <tbody>
                {[...Array(8).keys()].map((index) => (
                    <tr key={index}>{calendar[index]}</tr>
                ))}
            </tbody>
        </table>
    )
}

const Timeline = ({ player }: { player: string }) => {
    const [selectedYear, setSelectedYear] = useState(dayjs().year())

    const { data: gamesResponse } = useQuery<PlayerQueryResponse>(playerGames, {
        variables: { player, complete: true, year: selectedYear },
    })
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { data: unlockedAchievementResponse, refetch } =
        useQuery<PlayerQueryResponse>(playerUnlockedAchievements, {
            variables: {
                player,
                orderBy: "-datetime",
                year: selectedYear,
                limit: 100,
            },
        })

    useEffect(() => {
        const unlockedAchievements =
            unlockedAchievementResponse?.player?.unlockedAchievements
        if (
            !unlockedAchievementResponse ||
            unlockedAchievements?.pageInfo?.hasNextPage
        ) {
            refetch({
                variables: {
                    player,
                    year: selectedYear,
                    orderBy: "-datetime",
                    limit: 100,
                    cursor: unlockedAchievements?.pageInfo?.endCursor ?? "",
                },
                updateData: updateUnlockedAchievementData,
            }).catch(() => console.error("Refetch failed"))
        }
    }, [player, selectedYear, unlockedAchievementResponse, refetch])

    const perfectGames: PlayerOwnedGame[] = unwrapEdges(
        gamesResponse?.player?.games
    )
    const achievements: PlayerUnlockedAchievement[] = unwrapEdges(
        unlockedAchievementResponse?.player?.unlockedAchievements
    )

    return (
        <div>
            <div
                className="calendar-container"
                style={{
                    width: 650,
                    margin: "0 0 0 10px",
                    padding: 0,
                }}
            >
                <CalendarHeader
                    year={selectedYear}
                    onChangeYear={setSelectedYear}
                    totalPerfectGames={perfectGames.length}
                    totalUnlockedAchievements={achievements.length}
                />
                <Calendar
                    player={player}
                    year={selectedYear}
                    perfectGames={perfectGames}
                    achievements={achievements}
                />
            </div>
        </div>
    )
}

export default Timeline
