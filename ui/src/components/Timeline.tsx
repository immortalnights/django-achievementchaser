import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useState } from "react"
const VerticalCalendar = () => {
    // Get the current month and year
    const currentDate = dayjs()
    const currentMonth = currentDate.month()
    const currentYear = currentDate.year()

    // Function to generate and display the vertical calendar
    const displayVerticalCalendar = (month, year) => {
        const startDate = dayjs(`${year}-${month + 1}-01`)
        const daysInMonth = startDate.daysInMonth()

        const calendarWeeks = []
        let currentWeek = []

        const startDayOfWeek = Number(startDate.format("d"))
        console.log(startDayOfWeek)
        for (let i = startDayOfWeek; i > 1; i--) {
            currentWeek.push(
                <div key={i} className="day">
                    -
                </div>
            )
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = dayjs(`${year}-${month + 1}-${day}`)
            currentWeek.push(
                <div key={date.format("YYYY-MM-DD")} className="day">
                    {date.format("ddd D")}
                </div>
            )

            // Check if it's the last day of the week (Sunday) or the last day of the month
            if (date.day() === 0 || day === daysInMonth) {
                if (currentWeek.length < 7) {
                    for (let i = currentWeek.length; i < 7; i++) {
                        currentWeek.push(
                            <div key={i} className="day">
                                -
                            </div>
                        )
                    }
                }

                calendarWeeks.push(
                    <div key={date.format("YYYY-MM-DD")} className="week">
                        {currentWeek}
                    </div>
                )
                currentWeek = []
            }
        }

        return calendarWeeks
    }

    return (
        <div className="calendar">
            {displayVerticalCalendar(currentMonth, currentYear)}
        </div>
    )
}

const YearSelector = ({
    selected,
    onChange,
}: {
    selected: number
    onChange: (year: number) => void
}) => {
    const years = [...Array(6).keys()].map((count) => selected - 5 + count)
    const minYear = 2000
    const maxYear = dayjs().year()

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

const Timeline = () => {
    const [selectedYear, setSelectedYear] = useState(dayjs().year())
    const year = dayjs(`01-01-${selectedYear}`)
    const startOfTimeline = year.startOf("year")
    const endOfTimeline = year.endOf("year")
    const totalDays = endOfTimeline.diff(startOfTimeline, "days")

    console.log(startOfTimeline, endOfTimeline)

    const calendar: { [key: number]: React.JSX.Element } = {
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
        calendar[index].push(<td></td>)
    }

    for (let index = 0; index <= totalDays; index++) {
        calendar[day].push(
            <td className="day" title={currentDate.toString()}>
                <span className="sr-only">DATE</span>
            </td>
        )

        currentDate = currentDate.add(1, "day")
        day = Number(currentDate.format("d"))
    }

    return (
        <div>
            <div
                style={{
                    // backgroundColor: "yellow",
                    minWidth: 400,
                    margin: 5,
                    border: "1px solid lightgray",
                    padding: 5,
                }}
            >
                <YearSelector
                    selected={selectedYear}
                    onChange={(year) => setSelectedYear(year)}
                />
                <table className="">
                    {[...Array(8).keys()].map((index) => (
                        <tr>{calendar[index]}</tr>
                    ))}
                </table>
                {/* <VerticalCalendar /> */}
            </div>
        </div>
    )
}

export default Timeline
