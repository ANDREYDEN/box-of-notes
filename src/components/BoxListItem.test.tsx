import { render } from "@testing-library/react"
import React from "react"
import IBox from "../models/Box"
import BoxListItem from "./BoxListItem"

describe('BoxListItem', () => {
    it('should display basic box data', () => {
        const testBox: IBox = {
            description: 'test',
            openingTime: new Date()
        }
        const { getByText } = render(<BoxListItem box={testBox} />)

        const boxDescription = getByText(new RegExp(testBox.description!, 'g'))

        expect(boxDescription).toBeDefined()
    })
})