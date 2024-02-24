export const throwExpression = (errorMessage: string): never => {
    throw new Error(errorMessage)
}

//! return a percentage string for two numbers
export const percentage = (a: number, b: number) =>
    `${((a / b) * 100).toFixed(2)}%`
