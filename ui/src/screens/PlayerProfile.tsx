import request, { gql } from "graphql-request"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const PlayerPrivateStatistics = ({
    totalGames,
    playedGames,
    totalPlaytime,
}: {
    totalGames?: number
    playedGames?: number
    totalPlaytime?: number
}) => {
    return (
        <>
            <dd>{totalGames}</dd>
            <dt>Games</dt>
            <dd>{playedGames}</dd>
            <dt>Played</dt>
            <dd>{totalPlaytime}</dd>
            <dt>Playtime</dt>
        </>
    )
}

const PlayerStatistics = ({
    perfectGamesCount,
    achievementsUnlocked,
    totalAchievements,
    friends,
    totalGames,
    playedGames,
    totalPlaytime,
}: {
    perfectGamesCount?: number
    achievementsUnlocked?: number
    totalAchievements?: number
    friends?: PlayerFriend[]
    totalGames?: number
    playedGames?: number
    totalPlaytime?: number
}) => {
    return (
        <dl>
            <PlayerPrivateStatistics
                totalGames={totalGames}
                playedGames={playedGames}
                totalPlaytime={totalPlaytime}
            />
            <dd>{perfectGamesCount}</dd>
            <dt>Perfect Games</dt>
            <dd>
                {achievementsUnlocked} of {totalAchievements}
            </dd>
            <dt>Achievements Unlocked</dt>
            <dd>{friends?.length}</dd>
            <dt>Friends</dt>
        </dl>
    )
}

interface PlayerFriend {
    id: string
    name: string
    profileUrl: string
}

interface PlayerSummary {
    recentGames: unknown[]
    recentAchievements: unknown[]
    perfectGamesCount?: number
    achievementsUnlocked?: number
    totalAchievements?: number
    friends?: PlayerFriend[]
    totalGames?: number
    playedGames?: number
    totalPlaytime?: number
}

interface PlayerProfile {
    id: string
    name: string
    avatarM: string
    profileUrl?: string
    summary: PlayerSummary
    highestCompletionGame: unknown[]
    lowestCompletionGame: unknown[]
    easiestGames: unknown[]
    easiestAchievements: unknown
}

interface PlayerProfileResponse {
    profile: PlayerProfile
}

const PlayerHeader = ({
    id,
    name,
    avatarM,
    profileUrl,
    summary,
}: {
    id: string
    name?: string
    avatarM?: string
    profileUrl?: string
    summary?: PlayerSummary
}) => {
    return (
        <div>
            <div>
                <h2>{name}</h2>
                <img src={avatarM}></img>
            </div>
            <div>
                <PlayerStatistics {...summary} />
                <dl>
                    <dd>games</dd>
                    <dt>Recently Played</dt>
                    <dd>achievements</dd>
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
                {...profile.summary}
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
                        imgIconUrl
                        achievements {
                          name
                          displayName
                          description
                          iconUrl
                          globalPercentage
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
