import { useState } from "react"
import { request, RequestDocument } from "graphql-request"

interface State<T> {
    loading: boolean
    error: boolean
    data: T | null | undefined
}

export const useQuery = <ResponseType extends BaseQueryResponse, DataType>(
    doc: (...rest: string[]) => RequestDocument | RequestDocument[],
    transform: (response: ResponseType) => DataType | null | undefined,
    lazy = false
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

        let document = doc(...rest)

        if (Array.isArray(document)) {
            document = document.join("\n")
        }

        request<ResponseType>("/graphql/", `{${document}}`)
            .then((response) => {
                setState({
                    loading: false,
                    error: !!response.errors,
                    data: transform(response),
                })
            })
            .catch(() => {
                setState({
                    loading: false,
                    error: true,
                    data: undefined,
                })
            })
    }

    return { ...state, trigger: makeRequest }
}
