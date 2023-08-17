import BorderedImage from "./BorderedImage"
import FlexUnorderedList from "./FlexUnorderedList"

const AchievementIconList = ({
    player,
    achievements,
}: {
    player: string
    achievements: UnlockedAchievement[]
}) => (
    <FlexUnorderedList>
        {achievements.map((item) => (
            <li key={`${item.game.id}-${item.achievement.name}`}>
                <a
                    href={`/player/${player}/game/${item.game.id}`}
                    title={`${item.achievement.displayName} from ${item.game.name}`}
                >
                    <BorderedImage
                        src={`${item.achievement.iconUrl}`}
                        style={{
                            width: 32,
                            height: 32,
                        }}
                    />
                </a>
            </li>
        ))}
    </FlexUnorderedList>
)

export default AchievementIconList