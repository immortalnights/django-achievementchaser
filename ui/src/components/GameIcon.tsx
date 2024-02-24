import { forwardRef } from "react"
import BorderedImage from "./BorderedImage"

const GameIcon = forwardRef<HTMLImageElement, { id: string; name?: string }>(
    (props, ref) => (
        <BorderedImage
            alt={props.name}
            src={`https://media.steampowered.com/steam/apps/${props.id}/capsule_184x69.jpg`}
            {...props}
            ref={ref}
        />
    )
)

export default GameIcon
