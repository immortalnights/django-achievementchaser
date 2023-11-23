import { Box } from "@mui/material"
import Link from "./Link"
import ExternalLink from "./ExternalLink"
import BorderedImage from "./BorderedImage"

const GameIcon = ({ id, name }: Game) => {
    return (
        <div>
            <BorderedImage
                alt={name}
                src={`https://media.steampowered.com/steam/apps/${id}/capsule_184x69.jpg`}
            />
        </div>
    )
}

export default GameIcon
