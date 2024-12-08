import renderer from "react-test-renderer"
import { expect, test } from "vitest"
import GameHeader from "."
import { antenna } from "@test/data"
import { MemoryRouter } from "react-router-dom"

test("snapshot", () => {
    // eslint-disable-next-line
    const component = renderer.create(
        <MemoryRouter>
            <GameHeader game={antenna} />
        </MemoryRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
})
