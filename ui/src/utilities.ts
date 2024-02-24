export const throwExpression = (errorMessage: string): never => {
    throw new Error(errorMessage)
}

//! return a percentage string for two numbers
export const percentage = (a: number, b: number) =>
    `${((a / b) * 100).toFixed(2)}%`

//! duration
export const playtime = (playtime: number) => {
    const units = { minutes: 1, hrs: 60, days: 24, years: 365 } as const
    const keys = Object.keys(units)
    let value = playtime
    let index = 0
    for (; index < keys.length; index++) {
        const divider = units[keys[index] as keyof typeof units]
        if (value > divider) {
            value = value / divider
        } else {
            break
        }
    }

    return `${index > 1 ? value.toFixed(2) : value} ${keys[index - 1] ?? ""}`
}
