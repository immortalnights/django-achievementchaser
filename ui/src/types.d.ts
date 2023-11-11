type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

interface Connection<T> {
    edges: { node: T }[]
}
interface ResponseError {
    error: unknown
}

interface BaseQueryResponse {
    errors?: ResponseError[]
}

interface Game {
    id: number
    name?: string
    imgIconUrl: string
    difficultyPercentage: number
    lastPlayed: string
    playtime: number
    achievementCount: number
    achievements?: Achievement[]
    owners?: PlayerOwnedGame[]
    playerAchievements?: Connection<PlayerUnlockedAchievement>
    playerPlaytime?: Connection<PlayerGamePlaytime>

    // deprecated
    achievementSet?: Achievement[]
    iconUrl?: string
}

interface Achievement {
    id: string
    name: string // deprecated
    displayName?: string
    description?: string
    iconUrl?: string
    iconGreyUrl?: string
    globalPercentage?: number
    game?: Game
}

interface Player {
    id: string
    name?: string
    profileUrl?: string
    avatarSmallUrl?: string
    avatarMediumUrl?: string
    avatarLargeUrl?: string
    profile?: PlayerProfile
    games?: Connection<PlayerOwnedGame>
    unlockedAchievements?: Connection<PlayerUnlockedAchievement>
    availableAchievements?: Connection<Achievement>
}

interface PlayerOwnedGame {
    player?: Player
    game: Game
    lastPlayed?: string
    playtimeForever?: number
    completionPercentage?: number
    completed?: string
}

interface PlayerGamePlaytime {
    player: Player
    game: Game
    playtime: number
    datetime: string
}

interface PlayerUnlockedAchievement {
    player: Player
    game: Game
    achievement: Achievement
    datetime: string
}

interface PlayerProfile {
    ownedGames: number
    perfectGames: number
    playedGames: number
    totalPlaytime: number
    unlockedAchievements: number
    lockedAchievements: number
}

interface PlayersResponse extends BaseQueryResponse {
    players: Player[]
}

interface GameQueryResponse extends BaseQueryResponse {
    game: Game
}

interface PlayerQueryResponse extends BaseQueryResponse {
    player: Player | null
}

interface SearchQueryResponse extends BaseQueryResponse {
    searchPlayersAndGames: (Player | Game)[]
}

interface MaybeUnlockedAchievement extends Achievement {
    unlocked?: string
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
    player: {
        id: string
        games?: {
            edges: {
                node: PlayerOwnedGame
            }[]
        }
    }
}

interface PlayerOwnedGameResponseOLD extends BaseQueryResponse {
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
