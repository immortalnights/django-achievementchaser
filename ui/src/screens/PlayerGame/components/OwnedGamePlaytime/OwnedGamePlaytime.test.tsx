import renderer from "react-test-renderer"
import { expect, test } from "vitest"
import OwnedGamePlaytime from "."
import { playedPlayerOwnedGame } from "@test/data"

test("snapshot", () => {
    const component = renderer.create(
        <OwnedGamePlaytime {...playedPlayerOwnedGame} />
    )
    expect(component.toJSON()).toMatchSnapshot()
})
