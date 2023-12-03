import { LegacyRef, ForwardedRef, forwardRef, ReactNode } from "react"
import BorderedImage from "./BorderedImage"
import { Tooltip } from "@mui/material"

export const GameIconWithTooltip = ({
    game,
    tooltip,
}: {
    game: Game
    tooltip: ReactNode
}) => {
    const Wrapped = forwardRef((props, ref) => (
        <GameIcon {...game} {...props} innerRef={ref} />
    ))

    return (
        <Tooltip title={tooltip} arrow enterDelay={500} leaveDelay={0}>
            <Wrapped />
        </Tooltip>
    )
}

const GameIcon = ({
    id,
    name,
    innerRef,
    ...rest
}: Game & { innerRef?: ForwardedRef<unknown> }) => (
    <BorderedImage
        alt={name}
        src={`https://media.steampowered.com/steam/apps/${id}/capsule_184x69.jpg`}
        {...rest}
        ref={innerRef ? (innerRef as LegacyRef<HTMLImageElement>) : undefined}
    />
)

export default GameIcon
