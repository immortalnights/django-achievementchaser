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

interface GameOwner {
    player: Pick<Player, "id" | "name" | "avatarSmallUrl" | "avatarMediumUrl">
    lastPlayed: string | null
    playtimeForever: number
    unlockedAchievementCount: number
    completed: string | null
}

interface Game {
    id: string
    name: string
    imgIconUrl: string
    achievementCount: number
    difficultyPercentage: number
    owners?: Connection<GameOwner>
    achievements?: Achievement[]
}

interface PlayerOwnedGame extends Omit<GameOwner, "player"> {
    game: Game
}

interface Achievement {
    id: string
    displayName: string
    description: string
    iconUrl: string
    iconGrayUrl: string
    globalPercentage: number
    hidden?: boolean
}

interface AchievementWithGame extends Achievement {
    game: Omit<Game, "owners" | "achievement">
}

interface PlayerUnlockedAchievement {
    id: string
    datetime: string
    game: Omit<Game, "owners" | "achievement">
    achievement: Achievement
}

interface Player {
    id: string
    name: string
    profileUrl?: string
    avatarSmallUrl: string
    avatarMediumUrl: string
    avatarLargeUrl?: string
    profile?: PlayerProfile
    games?: Connection<PlayerOwnedGame>
    unlockedAchievements?: Connection<PlayerUnlockedAchievement>
    availableAchievements?: Connection<AchievementWithGame>
}

type GameWithAchievements = WithRequired<Game, "achievements">

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
