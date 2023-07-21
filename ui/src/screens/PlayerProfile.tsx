import request, { gql } from "graphql-request"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const PlayerPrivateStatistics = ({
    totalGamesCount,
    playedGamesCount,
    totalPlaytime,
}: Pick<
    PlayerSummary,
    "totalGamesCount" | "playedGamesCount" | "totalPlaytime"
>) => {
    console.log(totalGamesCount)
    return (
        <>
            <dd>{totalGamesCount}</dd>
            <dt>Games</dt>
            <dd>{playedGamesCount}</dd>
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

interface Game {}

interface Achievement {}

interface PlayerFriend {
    id: string
    name: string
    profileUrl: string
}

interface PlayerSummary {
    recentGames?: Game[]
    recentAchievements?: Achievement[]
    perfectGamesCount?: number
    achievementsUnlocked?: number
    totalAchievements?: number
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
