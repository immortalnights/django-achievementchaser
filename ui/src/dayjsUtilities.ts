import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import relativeTimePlugin from "dayjs/plugin/relativeTime"
import advancedFormatPlugin from "dayjs/plugin/advancedFormat"
import durationPlugin from "dayjs/plugin/duration"
import utcPlugin from "dayjs/plugin/utc"
import timezonePlugin from "dayjs/plugin/timezone"
import weekOfYear from "dayjs/plugin/weekOfYear"

export const setup = () => {
    dayjs.extend(customParseFormat)
    dayjs.extend(relativeTimePlugin)
    dayjs.extend(advancedFormatPlugin)
    dayjs.extend(durationPlugin)
    dayjs.extend(utcPlugin)
    dayjs.extend(timezonePlugin)
    dayjs.extend(weekOfYear)

    dayjs.tz.setDefault(dayjs.tz.guess())
}

export const formatDate = (date: string | dayjs.Dayjs) => {
    return dayjs(date).format("MMM Do, YYYY")
}

export const formatDateTime = (date: string | dayjs.Dayjs) => {
    return dayjs(date).format("HH:mm:ss on MMM Do, YYYY")
}

export const getRelativeTime = (date: string | dayjs.Dayjs) => {
    return dayjs(date).fromNow()
}

export const duration = (minutes: number) => {
    return dayjs.duration({ minutes })
}
