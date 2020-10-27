import { fireEvent, render, RenderResult } from "@testing-library/react";
import React from "react";
import IBox from "../models/Box";
import Firestore from "../utilities/database";
import { BoxCreate } from "./BoxCreate";
import { history } from '../history'
import { Router } from "react-router-dom";

const renderInRouter = (Comp: React.FC) =>
    render(
        <Router history={history}>
            <Comp />
        </Router>
    );

describe('BoxCreate', () => {
    let wrapper: RenderResult;

    beforeEach(() => {
        wrapper = renderInRouter(BoxCreate)
        history.push('/box')
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('creates a new box', async () => {
        Firestore.prototype.createBox = jest.fn(async (box: IBox) => { }).mockResolvedValue()

        const openingTimeString = '2020-02-02T05:00:00.000'
        const testBox: IBox = {
            description: "Test box",
            openingTime: new Date(openingTimeString)
        }

        const openingTime: HTMLElement = wrapper.getByLabelText("Opening Time")
        const description: HTMLElement = wrapper.getByLabelText("Description")
        const submit: HTMLElement = wrapper.getByText("Create Box")

        fireEvent.change(openingTime, {
            target: { value: openingTimeString }
        })
        fireEvent.change(description, {
            target: { value: testBox.description }
        })
        fireEvent.click(submit)

        expect(Firestore.prototype.createBox).toHaveBeenCalledWith(testBox)
    })

    it('redirects to home after submission', async () => {
        Firestore.prototype.createBox = jest.fn(async (box: IBox) => { }).mockResolvedValue()

        const openingTimeString = '2020-02-02T05:00:00.000'
        const testBox: IBox = {
            description: "Test box",
            openingTime: new Date(openingTimeString)
        }

        const openingTime: HTMLElement = wrapper.getByLabelText("Opening Time")
        const description: HTMLElement = wrapper.getByLabelText("Description")
        const submit: HTMLElement = wrapper.getByText("Create Box")

        fireEvent.change(openingTime, {
            target: { value: openingTimeString }
        })
        fireEvent.change(description, {
            target: { value: testBox.description }
        })
        fireEvent.click(submit)

        expect(history.location.pathname[location.pathname.length - 1]).toBe('/')
    })
})