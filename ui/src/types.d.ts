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
    name: string
    achievementCount: number
    iconUrl: string
}

interface PlayersResponse {
    players: Player[]
}

interface GameResponse {
    game: Game
}
