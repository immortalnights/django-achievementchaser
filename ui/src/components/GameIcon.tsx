import { forwardRef } from "react"
import BorderedImage from "./BorderedImage"

const GameIcon = forwardRef(({ id, name }: Game, ref) => (
    <BorderedImage
        alt={name}
        src={`https://media.steampowered.com/steam/apps/${id}/capsule_184x69.jpg`}
        {...ref}
    />
))

export default GameIcon
