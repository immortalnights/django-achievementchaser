import { Skeleton } from "@mui/material"

const SkeletonList = ({
    count,
    width = 32,
    height = 32,
}: {
    count: number
    width?: number
    height?: number
}) => {
    const items = new Array(count).fill(true)

    return (
        <>
            {items.map((_, index) => (
                <Skeleton key={index} width={width} height={height} />
            ))}
        </>
    )
}
export default SkeletonList
