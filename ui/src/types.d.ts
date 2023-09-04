type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
interface Player {
    id: string
    name?: string
    profileUrl?: string
    avatarSmallUrl?: string
    avatarMediumUrl?: string
    avatarLargeUrl?: string
    created?: string
    added?: string
    updated?: string
    resynchronized?: string | null
    resynchronizationRequired?: boolean
}

interface Game {
    id: number
    name?: string
    achievementSet?: Achievement[]
    iconUrl?: string
}

interface Achievement {
    name: string
    displayName?: string
    description?: string
    iconUrl?: string
    greyIconUrl?: string
    globalPercentage?: number
}

interface PlayersResponse {
    players: Player[]
}

interface GameResponse {
    game: Game
}

interface ResponseError {
    error: unknown
}

interface BaseQueryResponse {
    errors?: ResponseError[]
}

interface PlayerQueryResponse extends BaseQueryResponse {
    player: Player | null
}

interface PlayerProfileSummary {
    ownedGames: number
    perfectGames: number
    playedGames: number
    totalPlaytime: number
    unlockedAchievements: number
    lockedAchievements: number
}

interface PlayerProfileSummaryResponse extends BaseQueryResponse {
    playerProfileSummary: PlayerProfileSummary
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

interface OwnedGame {
    gameId: number
    name: string
    imgUrl: string
    completionPercentage: number
    difficultyPercentage: number
}

interface PlayerOwnedGameResponse extends BaseQueryResponse {
    playerGames: {
        edges?: { node: OwnedGame }[]
        totalCount?: number
    }
}

interface PlayerAchievementsResponse extends BaseQueryResponse {
    achievements: {
        id: string
        achievements: Achievement[]
    }
}
