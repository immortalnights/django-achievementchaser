import { LocalGraphQLClient } from "graphql-hooks"
import { test, expect } from "vitest"
import { player, playerGames, players } from "./documents"

test("players query", async () => {
    const playersResponseData = {
        data: {
            players: [
                {
                    id: "00000000000000001",
                    name: "Player1",
                },
                {
                    id: "00000000000000002",
                    name: "Player2",
                },
            ],
        },
    }

    const client = new LocalGraphQLClient({
        localQueries: {
            [players]: () => playersResponseData,
        },
    })

    const { data, error } = await client.request<PlayerQueryResponse>({
        query: players,
    })
    expect(data).toEqual(playersResponseData)
    expect(error).toBeUndefined()
})

test("player query", async () => {
    const client = new LocalGraphQLClient({
        localQueries: {
            [player]: ({ player }) => ({
                data: {
                    player: {
                        id: String(player),
                        name: "Player1",
                    },
                },
            }),
        },
    })

    const { data, error } = await client.request<PlayerQueryResponse>({
        query: player,
        variables: { player: 1 },
    })
    expect(data).toEqual({
        data: {
            player: {
                id: "1",
                name: "Player1",
            },
        },
    })
    expect(error).toBeUndefined()
})

test("player query error", async () => {
    const client = new LocalGraphQLClient({
        localQueries: {
            [player]: ({ player }) => ({
                errors: [
                    {
                        message: `Could not find Player with id '${player}' or name 'None'`,
                        locations: [
                            {
                                line: 2,
                                column: 3,
                            },
                        ],
                        path: ["player"],
                    },
                ],
                data: {
                    player: null,
                },
            }),
        },
    })

    const { data, error } = await client.request<PlayerQueryResponse>({
        query: player,
        variables: { player: 1 },
    })
    console.log(data, error)
    expect(data.data.player).toBeNull()
    expect(error).toBeUndefined()
})

test("player games query", async () => {
    const client = new LocalGraphQLClient({
        localQueries: {
            [playerGames]: ({
                player,
                // started,
                // completed,
                // year,
                // orderBy,
                // limit,
            }) => ({
                data: {
                    player: {
                        id: String(player),
                        name: "Player1",
                        games: {
                            edges: [
                                {
                                    node: {
                                        id: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                                    },
                                },
                            ],
                        },
                    },
                },
            }),
        },
    })

    const { data, error } = await client.request<PlayerQueryResponse>({
        query: playerGames,
        variables: {
            player: 1,
            started: true,
            completed: true,
            year: 2010,
            orderBy: "-completed",
            limit: 10,
        },
    })
    expect(data).toEqual({
        data: {
            player: {
                id: "1",
                name: "Player1",
                games: {
                    edges: [
                        {
                            node: {
                                id: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                            },
                        },
                    ],
                },
            },
        },
    })
    expect(error).toBeUndefined()
})
