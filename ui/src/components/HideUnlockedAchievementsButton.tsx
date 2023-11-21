import { TaskOutlined } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useContext } from "react"
import PlayerSettingsContext from "../context/PlayerSettingsContext"

const HideUnlockedAchievementsButton = () => {
    const { hideUnlockedAchievements, setHideUnlockedAchievements } =
        useContext(PlayerSettingsContext)

    return (
        <IconButton
            title={hideUnlockedAchievements ? "Hide Unlocked" : "Show Unlocked"}
            color={hideUnlockedAchievements ? "inherit" : "primary"}
            onClick={() =>
                setHideUnlockedAchievements(!hideUnlockedAchievements)
            }
        >
            <TaskOutlined />
        </IconButton>
    )
}
export default HideUnlockedAchievementsButton
