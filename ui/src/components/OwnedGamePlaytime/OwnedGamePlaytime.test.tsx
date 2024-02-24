import renderer from "react-test-renderer"
import { expect, test } from "vitest"
import OwnedGamePlaytime from "."
import { playedPlayerOwnedGame } from "@test/data"
import { setup } from "@/dayjsUtilities"

test("snapshot", () => {
    setup()

    const component = renderer.create(
        <OwnedGamePlaytime {...playedPlayerOwnedGame} />
    )
    expect(component.toJSON()).toMatchSnapshot()
})
