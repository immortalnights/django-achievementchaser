import dayjs from "dayjs"
import relativeTimePlugin from "dayjs/plugin/relativeTime"
import advancedFormatPlugin from "dayjs/plugin/advancedFormat"
import durationPlugin from "dayjs/plugin/duration"

export const throwExpression = (errorMessage: string): never => {
    throw new Error(errorMessage)
}
export const formatDate = (date: string | dayjs.Dayjs) => {
    dayjs.extend(advancedFormatPlugin)
    return dayjs(date).format("MMM Do, YYYY")
}

export const formatDateTime = (date: string | dayjs.Dayjs) => {
    dayjs.extend(advancedFormatPlugin)
    return dayjs(date).format("HH:MM:ss on MMM Do, YYYY")
}

export const getRelativeTime = (date: string | dayjs.Dayjs) => {
    dayjs.extend(relativeTimePlugin)
    return dayjs(date).fromNow()
}

export const duration = (minutes: number) => {
    dayjs.extend(durationPlugin)
    return dayjs.duration({ minutes })
}
