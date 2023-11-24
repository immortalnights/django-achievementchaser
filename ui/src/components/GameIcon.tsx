import BorderedImage from "./BorderedImage"

const GameIcon = ({ id, name }: Game) => (
    <BorderedImage
        alt={name}
        src={`https://media.steampowered.com/steam/apps/${id}/capsule_184x69.jpg`}
    />
)

export default GameIcon
