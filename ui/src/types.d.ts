type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

interface ResponseError {
    error: unknown
}

interface BaseQueryResponse {
    errors?: ResponseError[]
}

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
    iconGreyUrl?: string
    globalPercentage?: number
}

interface PlayersResponse extends BaseQueryResponse {
    players: Player[]
}

interface GameQueryResponse extends BaseQueryResponse {
    game: Game
}

interface GameAchievementsResponse extends BaseQueryResponse {
    gameAchievements: Achievement[]
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
    difficultyPercentage: number
    lastPlayed: string
    playtime: number
    achievementCount: number
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
    id: string
    name: string
    imgIconUrl?: string
    lastPlayed?: string
    difficultyPercentage?: number
    completionPercentage?: number
    completed?: string
    achievementCount?: number
    unlockedAchievementCount?: number
}

interface PlayerOwnedGameResponse extends BaseQueryResponse {
    playerGames: {
        edges?: { node: OwnedGame }[]
        totalCount?: number
    }
}

interface RecentAchievement {
    id: string
    displayName: string
    iconUrl: string
    iconGrayUrl: string
    globalPercentage: number
    unlocked: string
    game: {
        id: string
        name: string
    }
}

interface RecentGame {
    id: string
    name: string
    imgIconUrl: string
    lastPlayed: string
    difficultyPercentage: number
    completionPercentage: number
}

interface TimelineResponse
    extends PlayerAchievementsResponse,
        BaseQueryResponse {
    playerGames: {
        edges: { node: OwnedGame }[]
    }
}

interface PlayerAchievementsResponse extends BaseQueryResponse {
    playerAchievements: {
        edges: { node: RecentAchievement }[]
    }
}

interface GameOwnerInformation {
    game: Game
    player: Player
    lastPlayed?: string
    playtimeForever: number
    completionPercentage: number
    completed?: string
}

interface GameOwnersResponse extends BaseQueryResponse {
    players: GameOwnerInformation[]
}
