import { LegacyRef, ForwardedRef } from "react"
import BorderedImage from "./BorderedImage"

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
