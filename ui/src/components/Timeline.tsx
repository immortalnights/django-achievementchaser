import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useMemo, useState } from "react"
import {
    useQueryPlayerAchievements,
    useQueryPlayerTimelineAchievements,
} from "../api/queries"

const YearSelector = ({
    selected,
    onChange,
}: {
    selected: number
    onChange: (year: number) => void
}) => {
    const displayCount = 7
    const minYear = 2000
    const maxYear = dayjs().year()
    let startYear: number

    if (selected - Math.ceil(displayCount / 2) < minYear) {
        startYear = minYear
    } else if (selected + Math.floor(displayCount / 2) > maxYear) {
        startYear = maxYear - displayCount + 1
    } else {
        startYear = selected - Math.floor(displayCount / 2)
    }
    const years = [...Array(displayCount).keys()].map(
        (count) => startYear + count
    )

    const handlePreviousClick = () => onChange(selected - 1)
    const handleNextClick = () => onChange(selected + 1)

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
                onClick={handlePreviousClick}
                disabled={selected === minYear}
            >
                &lt;
            </button>
            {years.map((year) => (
                <div key={`year-${year}`} onClick={() => onChange(year)}>
                    {selected === year ? <strong>{year}</strong> : year}
                </div>
            ))}
            <button onClick={handleNextClick} disabled={selected === maxYear}>
                &gt;
            </button>
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
    const unlockedAchievementDates = useMemo(
        () => achievements.map((achievement) => dayjs(achievement.unlocked)),
        [achievements]
    )

    const getAchievementCount = (date: dayjs.Dayjs) =>
        unlockedAchievementDates.filter((item) => item.isSame(date, "day"))
            .length

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
    }, [yearDate])

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
    const { loading, error, data } = useQueryPlayerTimelineAchievements({
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
                    minHeight: 130,
                }}
            >
                <YearSelector
                    selected={selectedYear}
                    onChange={(year) => setSelectedYear(year)}
                />
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <Calendar year={selectedYear} achievements={achievements} />
                )}
            </div>
        </div>
    )
}

export default Timeline
