import { useContext } from "react"
import { IconButton } from "@mui/material"
import { HighlightOffRounded } from "@mui/icons-material"
import AchievementDisplayContext from "../../context/AchievementDisplayContext"

const ClearComparisonButton = () => {
    const { setOtherPlayer } = useContext(AchievementDisplayContext)

    const handleClick = () => setOtherPlayer(undefined)

    return (
        <IconButton title="Clear comparison" onClick={handleClick}>
            <HighlightOffRounded />
        </IconButton>
    )
}

export default ClearComparisonButton
