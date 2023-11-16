import { ChangeEvent, useMemo, useCallback, useState } from "react"
import dayjs from "dayjs"
import { InputLabel, NativeSelect } from "@mui/material"
import { useQueryPlayerTimeline } from "../api/queries"
import { formatDate } from "../utilities"

const YearSelector = ({
    selected,
    onChange,
    total,
}: {
    selected: number
    onChange: (year: number) => void
    total: number
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
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div style={{ marginLeft: 5 }}>Jan</div>
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
                <div style={{ marginLeft: 10 }}>
                    {total.toFixed(0).padStart(3, "0")} Total
                </div>
            </div>
            <div style={{ marginRight: 10 }}>Dec</div>
        </div>
    )
}

const Calendar = ({
    year,
    perfectGames,
    achievements,
}: {
    year: number
    perfectGames: PlayerOwnedGame[]
    achievements: PlayerUnlockedAchievement[]
}) => {
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
                    ].join(" ")}
                    title={title}
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
    const { data } = useQueryPlayerTimeline({
        player,
        year: selectedYear,
    })

    const perfectGames = data ? data.perfectGames : ([] as PlayerOwnedGame[])
    const achievements = data
        ? data.achievements
        : ([] as PlayerUnlockedAchievement[])

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
                <YearSelector
                    selected={selectedYear}
                    onChange={(year) => setSelectedYear(year)}
                    total={achievements.length}
                />
                <Calendar
                    year={selectedYear}
                    perfectGames={perfectGames}
                    achievements={achievements}
                />
            </div>
        </div>
    )
}

export default Timeline
