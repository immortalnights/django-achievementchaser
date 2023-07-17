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
    achievements?: Achievement[]
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
