import { useState } from "react"
import { request, gql } from "graphql-request"

export const useLazyQueryPlayers = () => {
    interface State {
        loading: boolean
        error: boolean
        data: Player | null | undefined
    }

    const [state, setState] = useState<State>({
        loading: false,
        error: false,
        data: null,
    })

    const makeRequest = (player: string) => {
        setState({
            loading: true,
            error: false,
            data: null,
        })

        request<PlayerQueryResponse>(
            "/graphql/",
            gql`{
                player(name: "${player}") {
            id
          }
        }
        `
        )
            .then((response) => {
                setState({
                    loading: false,
                    error: !!response.player,
                    data: response.player,
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
