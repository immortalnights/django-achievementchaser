import request, { gql } from "graphql-request"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Playtime = ({ playtime }: { playtime: number }) => {
    const units = { minutes: 1, hrs: 60, days: 24, years: 365 }
    const keys = Object.keys(units) as unknown as keyof typeof units
    let value = playtime
    let index = 0
    for (; index < keys.length; index++) {
        const divider = units[keys[index] as keyof typeof units]
        if (value > divider) {
            value = value / divider
        } else {
            break
        }
    }

    return `${index > 1 ? value.toFixed(2) : value} ${keys[index - 1] ?? ""}`
}

const PlayerPrivateStatistics = ({
    totalGamesCount,
    playedGamesCount,
    totalPlaytime,
}: Pick<
    PlayerSummary,
    "totalGamesCount" | "playedGamesCount" | "totalPlaytime"
>) => {
    return (
        <>
            <dd>{totalGamesCount}</dd>
            <dt>Games</dt>
            <dd title={`${playedGamesCount} of ${totalGamesCount}`}>
                {totalGamesCount && playedGamesCount
                    ? `${(totalGamesCount / playedGamesCount).toFixed(2)}%`
                    : "-"}
            </dd>
            <dt>Played</dt>
            <dd>
                <Playtime playtime={0} />
            </dd>
            <dt>Playtime</dt>
        </>
    )
}

const PlayerStatistics = ({
    perfectGamesCount,
    achievementsUnlockedCount,
    totalAchievementCount,
    friends,
    totalGamesCount,
    playedGamesCount,
    totalPlaytime,
}: PlayerSummary) => {
    return (
        <dl>
            <PlayerPrivateStatistics
                totalGamesCount={totalGamesCount}
                playedGamesCount={playedGamesCount}
                totalPlaytime={totalPlaytime}
            />
            <dd
                title={`${
                    perfectGamesCount && totalGamesCount
                        ? (perfectGamesCount / totalGamesCount).toFixed(2)
                        : 0
                }%`}
            >
                {perfectGamesCount ?? "-"}
            </dd>
            <dt>Perfect Games</dt>
            <dd
                title={`${achievementsUnlockedCount} of ${totalAchievementCount}`}
            >
                {totalAchievementCount && achievementsUnlockedCount
                    ? `${(
                          achievementsUnlockedCount / totalAchievementCount
                      ).toFixed(2)}%`
                    : "-"}
            </dd>
            <dt>Achievements Unlocked</dt>
            <dd>{friends?.length ?? "-"}</dd>
            <dt>Friends</dt>
        </dl>
    )
}

interface Game {
    id: string
    name: string
    imgIconUrl: string
    lastPlayed: string
    playtime: number
}

interface Achievement {
    name: string
    displayName: string
    iconUrl: string
    iconGrayUrl: string
    game?: Game
}

interface UnlockedAchievement {
    game: Pick<Game, "id" | "name">
    achievement: Achievement
    datetime: string
}

interface PlayerFriend {
    id: string
    name: string
    profileUrl: string
}

interface PlayerSummary {
    recentGames?: Game[]
    recentAchievements?: UnlockedAchievement[]
    perfectGamesCount?: number
    achievementsUnlockedCount?: number
    totalAchievementCount?: number
    friends?: PlayerFriend[]
    totalGamesCount?: number
    playedGamesCount?: number
    totalPlaytime?: number
}

interface PlayerProfile {
    id: string
    name: string
    avatarLargeUrl?: string
    profileUrl?: string
    summary?: PlayerSummary
    highestCompletionGame?: unknown[]
    lowestCompletionGame?: unknown[]
    easiestGames?: unknown[]
    easiestAchievements?: unknown
}

interface PlayerProfileResponse {
    profile: PlayerProfile
}

const PlayerHeader = ({
    id,
    name,
    avatarLargeUrl,
    profileUrl,
    summary,
}: {
    id: string
    name?: string
    avatarLargeUrl?: string
    profileUrl?: string
    summary?: PlayerSummary
}) => {
    return (
        <div>
            <div>
                <h2>{name}</h2>
                <img src={avatarLargeUrl} />
            </div>
            <div>
                <PlayerStatistics {...summary} />
                <dl>
                    <dd>
                        <ul
                            style={{
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                                display: "flex",
                                gap: 8,
                            }}
                        >
                            {summary?.recentGames?.map((game) => (
                                <li key={game.id}>
                                    <a
                                        href={`/player/${id}/game/${game.id}`}
                                        title={game.name}
                                    >
                                        <img
                                            src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.id}/${game.imgIconUrl}.jpg`}
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </dd>
                    <dt>Recently Played</dt>
                    <dd>
                        <ul
                            style={{
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                                display: "flex",
                                gap: 8,
                            }}
                        >
                            {summary?.recentAchievements?.map((item) => (
                                <li
                                    key={`${item.game.id}/${item.achievement.name}`}
                                >
                                    <a
                                        href={`/player/${id}/game/${item.game.id}`}
                                        title={`${item.achievement.displayName} from ${item.game.name}`}
                                    >
                                        <img
                                            src={`${item.achievement.iconUrl}`}
                                            style={{ width: 32, height: 32 }}
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </dd>
                    <dt>Recently Unlocked</dt>
                </dl>
            </div>
        </div>
    )
}

const GameList = () => {
    return null
}
const GameAchievementList = () => {
    return null
}

const PlayerProfileContent = (profile: PlayerProfile) => {
    return (
        <>
            <PlayerHeader
                id={profile.id}
                name={profile.name}
                avatarLargeUrl={profile.avatarLargeUrl}
                summary={profile.summary}
            />
            <h4>Almost There</h4>
            <GameList />
            <h4>Just Started</h4>
            <GameList />
            <h4>Next Game</h4>
            <GameList />
            <h4>Next Achievement</h4>
            <GameAchievementList />
        </>
    )
}

const PlayerProfileScreen = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState<PlayerProfile>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>()

    useEffect(() => {
        request<PlayerProfileResponse>(
            "/graphql/",
            gql`
                {
                    profile(id: ${id}) {
                        id
                        name
                        profileUrl
                        avatarLargeUrl
                        summary {
                            totalPlaytime
                            totalGamesCount
                            playedGamesCount
                            perfectGamesCount
                            totalAchievementCount
                            achievementsUnlockedCount
                            recentGames {
                                id
                                name
                                imgIconUrl
                                lastPlayed
                                playtime
                            }
                            recentAchievements {
                                game {
                                    name
                                    id
                                }
                                achievement {
                                    name
                                    iconUrl
                                    displayName
                                }
                                datetime
                            }
                        }
                    }
                }
            `
        )
            .then((resp) => {
                setLoading(false)
                setProfile(resp.profile)
            })
            .catch((err) => {
                setLoading(false)
                setError("Failed")
            })
    }, [])

    let content
    if (loading) {
        content = <div>Loading...</div>
    } else if (profile) {
        content = <PlayerProfileContent {...profile} />
    } else if (error) {
        content = <div>Error.</div>
    }

    return <div>{content}</div>
}

export default PlayerProfileScreen
