import request, { gql } from "graphql-request"
import { ReactNode, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useQueryPlayerProfile } from "../api/queries"
import Loader from "../components/Loader"
import { throwExpression } from "../utilities"
import { Box, Grid, Typography } from "@mui/material"

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

const MetaData = ({
    label,
    value,
    title,
}: {
    label: string
    value: ReactNode | string | number
    title?: string
}) => (
    <>
        <Typography variant="subtitle1" textTransform="uppercase">
            {label}
        </Typography>
        <Typography variant="body1" title={title}>
            {value}
        </Typography>
    </>
)

const PlayerPrivateStatistics = ({
    totalGamesCount,
    playedGamesCount,
    totalPlaytime,
}: Pick<
    PlayerSummary,
    "totalGamesCount" | "playedGamesCount" | "totalPlaytime"
>) => {
    return (
        <Box display={{ xs: "none", md: "block" }}>
            <Grid container>
                <Grid xs={false} md={4}>
                    <MetaData label="Games" value={totalGamesCount ?? 0} />
                </Grid>
                <Grid xs={false} md={4}>
                    <MetaData
                        label="Played"
                        value={
                            totalGamesCount && playedGamesCount
                                ? `${(
                                      totalGamesCount / playedGamesCount
                                  ).toFixed(2)}%`
                                : "-"
                        }
                        title={`${playedGamesCount} of ${totalGamesCount}`}
                    />
                </Grid>
                <Grid xs={false} md={4}>
                    <MetaData
                        label="Playtime"
                        value={<Playtime playtime={totalPlaytime ?? 0} />}
                    />
                </Grid>
            </Grid>
        </Box>
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
        <Grid container>
            <Grid xs={12}>
                <PlayerPrivateStatistics
                    totalGamesCount={totalGamesCount}
                    playedGamesCount={playedGamesCount}
                    totalPlaytime={totalPlaytime}
                />
            </Grid>
            <Grid md={4}>
                <MetaData
                    label="Perfect Games"
                    value={perfectGamesCount ?? "-"}
                    title={`${
                        perfectGamesCount && totalGamesCount
                            ? (perfectGamesCount / totalGamesCount).toFixed(2)
                            : 0
                    }%`}
                />
            </Grid>
            <Grid md={4}>
                <MetaData
                    label="Achievements Unlocked"
                    value={
                        totalAchievementCount && achievementsUnlockedCount
                            ? `${(
                                  achievementsUnlockedCount /
                                  totalAchievementCount
                              ).toFixed(2)}%`
                            : "-"
                    }
                    title={`${achievementsUnlockedCount} of ${totalAchievementCount}`}
                />
            </Grid>
            <Grid md={4}>
                <MetaData label="Friends" value={friends?.length ?? "-"} />
            </Grid>
        </Grid>
    )
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
        <>
            <h2>{name}</h2>
            <Grid container>
                <Grid xs={2}>
                    <img src={avatarLargeUrl} />
                </Grid>
                <Grid xs>
                    <PlayerStatistics {...summary} />
                    <Grid container>
                        <Grid xs={6}>
                            <Typography
                                variant="subtitle1"
                                textTransform="uppercase"
                            >
                                Recently Played
                            </Typography>
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
                        </Grid>
                        <Grid xs={6}>
                            <Typography
                                variant="subtitle1"
                                textTransform="uppercase"
                            >
                                Recently Unlocked
                            </Typography>
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
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                }}
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

const OwnedGameList = ({
    player,
    games,
}: {
    player: string
    games: OwnedGame[]
}) => {
    const set = games.slice(0, 12)

    return (
        <ul
            style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                gap: "0.5em",
            }}
        >
            {set.map((game) => (
                <li>
                    <a href={`/player/${player}/game/${game.game.id}`}>
                        <img
                            src={`https://media.steampowered.com/steam/apps/${game.game.id}/capsule_184x69.jpg`}
                            title={`${game.game.name} - ${(
                                game.completionPercentage * 100
                            ).toFixed(2)}%`}
                        />
                    </a>
                </li>
            ))}
        </ul>
    )
}

const PlayerGameAchievementList = () => {
    return null
}

const PlayerAlmostThereGames = ({ player }: { player: string }) => {
    const [ownedGames, setOwnedGames] = useState<OwnedGame[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>()

    useEffect(() => {
        // ignoreComplete: true
        // ignoreGames: []
        // limit: 12
        request<PlayerOwnedGameResponse>(
            "/graphql/",
            gql`
                {
                    ownedGames(
                        player: ${player}
                        orderBy: "completionPercentage"
                        limit: 12
                        ignoreComplete: true
                        ignoreGames: []
                    ) {
                        game {
                            id
                            name
                            imgIconUrl
                            difficultyPercentage
                        }
                        id
                        completionPercentage
                    }
                }
            `
        )
            .then((resp) => {
                setLoading(false)
                setOwnedGames(resp.ownedGames)
            })
            .catch((err) => {
                setLoading(false)
                setError("Failed")
            })
    }, [])

    let content
    if (loading) {
        content = <div>Loading...</div>
    } else if (ownedGames.length > 0) {
        content = <OwnedGameList player={player} games={ownedGames} />
    } else if (error) {
        content = <div>Error.</div>
    }

    return <div>{content}</div>
}

const PlayerJustStartedGames = ({ player }: { player: string }) => {
    const [ownedGames, setOwnedGames] = useState<OwnedGame[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>()

    useEffect(() => {
        request<PlayerOwnedGameResponse>(
            "/graphql/",
            gql`
                {
                    ownedGames(
                        player: ${player}
                        orderBy: "completionPercentage ASC"
                        limit: 12
                        ignoreNotStarted: true
                        ignoreGames: []
                    ) {
                        game {
                            id
                            name
                            imgIconUrl
                            difficultyPercentage
                        }
                        id
                        completionPercentage
                    }
                }
            `
        )
            .then((resp) => {
                setLoading(false)
                setOwnedGames(resp.ownedGames)
            })
            .catch((err) => {
                setLoading(false)
                setError("Failed")
            })
    }, [])

    let content
    if (loading) {
        content = <div>Loading...</div>
    } else if (ownedGames.length > 0) {
        content = <OwnedGameList player={player} games={ownedGames} />
    } else if (error) {
        content = <div>Error.</div>
    }

    return <div>{content}</div>
}

const PlayerEasiestGames = ({ player }: { player: string }) => {
    const [ownedGames, setOwnedGames] = useState<OwnedGame[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>()

    useEffect(() => {
        request<PlayerOwnedGameResponse>(
            "/graphql/",
            gql`
                {
                    ownedGames(
                        player: ${player}
                        orderBy: "difficultyPercentage DESC"
                        limit: 12
                        ignoreComplete: true
                        ignoreGames: []
                    ) {
                        game {
                            id
                            name
                            imgIconUrl
                            difficultyPercentage
                        }
                        completionPercentage
                    }
                }
            `
        )
            .then((resp) => {
                setLoading(false)
                setOwnedGames(resp.ownedGames)
            })
            .catch((err) => {
                setLoading(false)
                setError("Failed")
            })
    }, [])

    let content
    if (loading) {
        content = <div>Loading...</div>
    } else if (ownedGames.length > 0) {
        content = <OwnedGameList player={player} games={ownedGames} />
    } else if (error) {
        content = <div>Error.</div>
    }

    return <div>{content}</div>
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
            <Typography variant="h5">Almost There</Typography>
            <PlayerAlmostThereGames player={profile.id} />
            <Typography variant="h5">Just Started</Typography>
            <PlayerJustStartedGames player={profile.id} />
            <Typography variant="h5">Next Game</Typography>
            <PlayerEasiestGames player={profile.id} />
            <Typography variant="h5">Next Achievement</Typography>
            <PlayerGameAchievementList />
        </>
    )
}

const PlayerProfileScreen = () => {
    const { id = throwExpression("missing param") } = useParams()
    const { loading, error, data } = useQueryPlayerProfile(id)

    return (
        <Loader
            loading={loading}
            error={error}
            data={data}
            renderer={(data) => {
                return <PlayerProfileContent {...data} />
            }}
        />
    )
}

export default PlayerProfileScreen
