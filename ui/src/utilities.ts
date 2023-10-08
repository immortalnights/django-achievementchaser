import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import advancedFormat from "dayjs/plugin/advancedFormat"

export const throwExpression = (errorMessage: string): never => {
    throw new Error(errorMessage)
}
export const formatDate = (date: string | dayjs.Dayjs) => {
    dayjs.extend(advancedFormat)
    return dayjs(date).format("MMM Do, YYYY")
}

export const formatDateTime = (date: string | dayjs.Dayjs) => {
    dayjs.extend(advancedFormat)
    return dayjs(date).format("HH:MM:ss on MMM Do, YYYY")
}

export const getRelativeTime = (date: string | dayjs.Dayjs) => {
    dayjs.extend(relativeTime)
    return dayjs(date).fromNow()
}
