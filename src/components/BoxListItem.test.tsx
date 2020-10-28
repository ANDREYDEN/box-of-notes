import { render, RenderResult } from "@testing-library/react"
import React from "react"
import IBox from "../models/Box"
import { renderInRouter } from "../testing"
import { Urls } from "../types/urls"
import BoxListItem from "./BoxListItem"
import { Home } from "./Home"
import { history } from '../history'

const testBox: IBox = {
    id: 'testId',
    description: 'test',
    openingTime: new Date()
}

describe('BoxListItem', () => {
    let wrapper: RenderResult

    beforeEach(() => {
        wrapper = renderInRouter(Home);
        history.push(Urls.Home)
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('should display basic box data', () => {
        const { getByText } = render(<BoxListItem box={testBox} />)

        const boxDescription = getByText(new RegExp(testBox.description!, 'g'))

        expect(boxDescription).toBeDefined()
    })

    it.todo('should forward to the box page on click')
})