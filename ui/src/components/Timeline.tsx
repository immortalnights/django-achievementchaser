import { ChangeEvent, useMemo, useCallback, useState } from "react"
import dayjs from "dayjs"
import { InputLabel, NativeSelect } from "@mui/material"
import { useQueryPlayerTimelineAchievements } from "../api/queries"

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
                justifyContent: "space-between",
                alignItems: "flex-end",
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
            </div>
            <div style={{ marginRight: "2em" }}>Dec</div>
        </div>
    )
}

const Calendar = ({
    year,
    achievements,
}: {
    year: number
    achievements: RecentAchievement[]
}) => {
    console.log("Calendar", year)
    const yearDate = dayjs(`01-01-${year}`)

    // Make all achievements have a dayjs object
    const unlockedAchievementIndex = useMemo(() => {
        const index: { [key: string]: number } = {}
        achievements.forEach((achievement) => {
            const date = dayjs(achievement.unlocked).format("DD-MM-YYYY")
            if (!index[date]) {
                index[date] = 0
            }

            index[date] += 1
        })

        return index
    }, [achievements])

    const getAchievementCount = useCallback(
        (date: dayjs.Dayjs) =>
            unlockedAchievementIndex[date.format("DD-MM-YYYY")] ?? 0,
        [unlockedAchievementIndex]
    )

    const calendar = useMemo(() => {
        console.time("Building calendar")
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
            const count = getAchievementCount(currentDate)

            let colorClassName = "none"
            if (count > 0 && count < 6) {
                colorClassName = "low"
            } else if (count > 6 && count < 20) {
                colorClassName = "med"
            } else if (count > 20) {
                colorClassName = "high"
            }

            const dateString = currentDate.format("DD/MM/YYYY")

            calendar[day].push(
                <td
                    key={dateString}
                    className={["day", colorClassName, "light"].join(" ")}
                    style={{ border: "none" }}
                    title={`${count} achievements on ${dateString}`}
                >
                    <span className="sr-only">{dateString}</span>
                </td>
            )

            currentDate = currentDate.add(1, "day")
            day = Number(currentDate.format("d"))
        }

        console.timeEnd("Building calendar")
        return calendar
    }, [getAchievementCount, yearDate])

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
    const { loading, data } = useQueryPlayerTimelineAchievements({
        player,
        year: selectedYear,
    })

    const achievements = data ? data : ([] as RecentAchievement[])

    return (
        <div>
            <div
                className="calendar-container"
                style={{
                    width: 650,
                    margin: 5,
                    padding: 5,
                }}
            >
                <YearSelector
                    selected={selectedYear}
                    onChange={(year) => setSelectedYear(year)}
                />
                {loading ? (
                    <Calendar year={selectedYear} achievements={[]} />
                ) : (
                    <Calendar year={selectedYear} achievements={achievements} />
                )}
            </div>
        </div>
    )
}

export default Timeline
