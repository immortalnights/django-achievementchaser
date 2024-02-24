import { Skeleton } from "@mui/material"
import { ReactNode } from "react"

const SkeletonList = ({
    count,
    width = 32,
    height = 32,
}: {
    count: number
    width?: number
    height?: number
}) => {
    let index = 0
    const items = new Array(count).fill(
        <Skeleton key={index++} width={width} height={height} />
    ) as ReactNode[]

    return <>{items.map((item) => item)}</>
}
export default SkeletonList
