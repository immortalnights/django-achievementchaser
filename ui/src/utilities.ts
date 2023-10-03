import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

export const throwExpression = (errorMessage: string): never => {
    throw new Error(errorMessage)
}
export const formatDate = (date: string | dayjs.Dayjs) =>
    dayjs(date).format("MMM D, YYYY")

export const getRelativeTime = (date: string | dayjs.Dayjs) => {
    dayjs.extend(relativeTime)
    return dayjs(date).fromNow()
}
