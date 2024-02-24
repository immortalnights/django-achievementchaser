type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

interface Connection<T> {
    edges: { node: T }[]
    pageInfo?: {
        hasNextPage?: boolean
        hasPreviousPage?: boolean
        endCursor?: string
        startCursor?: string
    }
}
interface ResponseError {
    error: unknown
}

interface BaseQueryResponse {
    errors?: ResponseError[]
}

interface Game {
    id: string
    name: string
    imgIconUrl?: string
    difficultyPercentage: number
    achievementCount: number
    achievements?: Achievement[]
    owners?: Connection<Omit<PlayerOwnedGame, "game">>
    playerAchievements?: Connection<PlayerUnlockedAchievement>
    playerPlaytime?: Connection<PlayerGamePlaytime>
}

type GameWithAchievements = WithRequired<Game, "achievements">

interface Achievement {
    id: string
    displayName?: string
    description?: string
    iconUrl?: string
    iconGrayUrl?: string
    globalPercentage?: number
    hidden?: boolean
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
    game?: PlayerOwnedGame
    games?: Connection<PlayerOwnedGame>
    unlockedAchievements?: Connection<PlayerUnlockedAchievement>
    availableAchievements?: Connection<Achievement>
}

interface PlayerOwnedGame {
    player?: Player
    game: Game
    lastPlayed: string | null
    playtimeForever?: number
    completionPercentage?: number
    completed: string | null
    unlockedAchievements?: Connection<PlayerUnlockedAchievement>
    unlockedAchievementCount?: number
}

interface PlayerGamePlaytime {
    player: Player
    game: Game
    playtime: number
    datetime: string
}

interface PlayerUnlockedAchievement {
    id: string
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

interface PlayerFriend {
    id: string
    name: string
    profileUrl: string
}

interface PlayersQueryResponse extends BaseQueryResponse {
    players: Player[]
}

interface PlayerQueryResponse extends BaseQueryResponse {
    player: Player | null
}

interface GamesQueryResponse extends BaseQueryResponse {
    game: Game[]
}

interface GameQueryResponse extends BaseQueryResponse {
    game: Game | null
}

type SearchQueryResults = ((Player & { playerId: string }) | Game)[]
interface SearchQueryResponse extends BaseQueryResponse {
    searchPlayersAndGames: SearchQueryResults
}
