import { useEffect, useMemo, useState } from "react"
import { request, gql, RequestDocument } from "graphql-request"

interface State<T> {
    loading: boolean
    error: boolean
    data: T | null | undefined
}

const useQuery = <ResponseType extends BaseQueryResponse, DataType>(
    doc: (...rest: string[]) => RequestDocument,
    transform: (response: ResponseType) => DataType | null | undefined,
    lazy: boolean = false
) => {
    const [state, setState] = useState<State<DataType>>({
        loading: !lazy,
        error: false,
        data: null,
    })

    const makeRequest = (...rest: string[]) => {
        setState({
            loading: true,
            error: false,
            data: null,
        })

        request<ResponseType>("/graphql/", doc(...rest))
            .then((response) => {
                setState({
                    loading: false,
                    error: !!response.errors,
                    data: transform(response),
                })
            })
            .catch((err) => {
                setState({
                    loading: false,
                    error: true,
                    data: undefined,
                })
            })
    }

    return { ...state, trigger: makeRequest }
}

export const useLazyQueryPlayers = () => {
    return useQuery<PlayerQueryResponse, Player>(
        (player: string) => gql`{
        player(name: "${player}") {
    id
  }
}
`,
        (response) => response.player,
        true
    )
}

export const useQueryPlayerProfile = (player: string) => {
    const { loading, error, data, trigger } = useQuery<
        PlayerProfileResponse,
        PlayerProfile
    >(
        (player: string) => gql`
    {
        profile(id: ${player}) {
            id
            name
            profileUrl
            avatarLargeUrl
            summary {
                totalPlaytime
                totalGamesCount
                playedGamesCount
                perfectGamesCount
                totalAchievementCount
                achievementsUnlockedCount
                recentGames {
                    id
                    name
                    imgIconUrl
                    lastPlayed
                    playtime
                }
                recentAchievements {
                    game {
                        name
                        id
                    }
                    achievement {
                        name
                        iconUrl
                        displayName
                    }
                    datetime
                }
            }
        }
    }
`,
        (response) => response.profile
    )

    useEffect(() => trigger(player), [])

    return { loading, error, data }
}
