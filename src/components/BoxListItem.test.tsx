import { render, RenderResult } from "@testing-library/react"
import React from "react"
import IBox from "../models/Box"
import { Urls } from "../types/urls"
import BoxListItem from "./BoxListItem"
import { history } from '../history'

const testBox: IBox = {
    id: 'testId',
    description: 'test',
    openingTime: new Date()
}

describe('BoxListItem', () => {
    let wrapper: RenderResult

    beforeEach(() => {
        wrapper = render(<BoxListItem box={testBox} />)
        history.push(Urls.Home)
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('should display basic box data', () => {
        const boxDescription = wrapper.getByText(new RegExp(testBox.description!, 'g'))

        expect(boxDescription).toBeDefined()
    })

    it.todo('should forward to the box page on click')
})