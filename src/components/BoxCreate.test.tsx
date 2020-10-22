import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import IBox from "../models/Box";
import Firestore from "../utilities/database";
import BoxCreate from "./BoxCreate";

describe('BoxCreate', () => {
    it('creates a new box', async () => {
        Firestore.prototype.createBox = jest.fn(async (box: IBox) => { console.log(box) }).mockResolvedValue()

        const testBox: IBox = {
            description: "Test box",
            openingTime: new Date('2020/02/02')
        }

        const { getByLabelText, getByText } = render(<BoxCreate />)
        const openingTime: HTMLElement = getByLabelText("Opening Time")
        const description: HTMLElement = getByLabelText("Description")
        const submit: HTMLElement = getByText("Create Box")

        fireEvent.change(openingTime, {
            target: { value: testBox.openingTime?.toLocaleString() }
        })
        fireEvent.change(description, {
            target: { value: testBox.description }
        })
        fireEvent.click(submit)

        expect(Firestore.prototype.createBox).toHaveBeenCalledWith(testBox)
    })
})