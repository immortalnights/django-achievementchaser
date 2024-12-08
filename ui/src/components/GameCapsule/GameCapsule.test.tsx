import renderer from "react-test-renderer"
import { expect, test } from "vitest"
import GameCapsule from "."
import { MemoryRouter } from "react-router-dom"
import {
    neverPlayedOwnedGame,
    perfectPlayerOwnedGame,
    playedPlayerOwnedGame,
} from "@test/data"

test("snapshot", () => {
    const game = {
        name: "Crusader Kings III",
        id: "1158310",
        imgIconUrl: "8a0d88dfaff790ea1aa2b9fcf50d4e3b4f49cf56",
        achievementCount: 117,
        difficultyPercentage: 0.10000000149011612,
    } satisfies Game

    // game
    // eslint-disable-next-line
    const gameCapsule = renderer.create(
        <MemoryRouter>
            <GameCapsule game={game} />
        </MemoryRouter>
    )
    expect(gameCapsule.toJSON()).toMatchSnapshot()

    // game, link to player
    // eslint-disable-next-line
    const gameLinkToPlayer = renderer.create(
        <MemoryRouter>
            <GameCapsule game={game} player="1234" />
        </MemoryRouter>
    )
    expect(gameLinkToPlayer.toJSON()).toMatchSnapshot()

    // game with owned game information
    // eslint-disable-next-line
    const neverPlayedGame = renderer.create(
        <MemoryRouter>
            <GameCapsule game={game} ownedGame={neverPlayedOwnedGame} />
        </MemoryRouter>
    )
    expect(neverPlayedGame.toJSON()).toMatchSnapshot()

    // eslint-disable-next-line
    const perfectGame = renderer.create(
        <MemoryRouter>
            <GameCapsule game={game} ownedGame={perfectPlayerOwnedGame} />
        </MemoryRouter>
    )
    expect(perfectGame.toJSON()).toMatchSnapshot()

    // game with owned game information
    // eslint-disable-next-line
    const playedGame = renderer.create(
        <MemoryRouter>
            <GameCapsule game={game} ownedGame={playedPlayerOwnedGame} />
        </MemoryRouter>
    )
    expect(playedGame.toJSON()).toMatchSnapshot()
})
