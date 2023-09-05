import { Link } from "react-router-dom"
import BorderedImage from "./BorderedImage"
import FlexUnorderedList from "./FlexUnorderedList"

const AchievementIconList = ({
    player,
    achievements,
}: {
    player: string
    achievements: RecentAchievement[]
}) => (
    <FlexUnorderedList>
        {achievements.map((item) => (
            <li key={`${item.game.id}-${item.id}`}>
                <Link
                    to={`/player/${player}/game/${item.game.id}`}
                    title={`${item.displayName} from ${item.game.name}`}
                >
                    <BorderedImage
                        src={`${item.iconUrl}`}
                        style={{
                            width: 32,
                            height: 32,
                        }}
                    />
                </Link>
            </li>
        ))}
    </FlexUnorderedList>
)

export default AchievementIconList
