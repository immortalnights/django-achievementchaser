import { ReactNode } from "react"

const Loader = <T,>({
    loading,
    error,
    data,
    renderer,
}: {
    loading: boolean
    error: unknown
    data: T
    renderer: (data: NonNullable<T>) => ReactNode
}) => {
    let content
    if (loading) {
        content = <div>Loading...</div>
    } else if (error) {
        content = <div>Error.</div>
    } else if (data) {
        content = renderer(data)
    } else {
        throw new Error("Loader failed")
    }

    return <div>{content}</div>
}

export default Loader
