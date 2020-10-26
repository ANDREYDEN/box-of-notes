import { render } from "@testing-library/react";
import React from "react";
import IBox from "../models/Box";
import BoxList from "./BoxList";

describe('BoxList', () => {
    it('displays the list of boxes', () => {
        const testBoxes: IBox[] = [
            {
                id: '1',
                description: 'first',
                openingTime: new Date('01/01/2020')
            },
            {
                id: '2',
                description: 'second',
                openingTime: new Date('02/02/2020')
            }
        ]
        const { getAllByTestId } = render(<BoxList boxes={testBoxes} />);

        const boxElements: HTMLElement[] = getAllByTestId('box-item')
        boxElements.forEach((element, i) => {
            expect(element).toContainHTML(testBoxes[i].description!)
            expect(element).toContainHTML(testBoxes[i].openingTime!.toString())
        })
    })
})