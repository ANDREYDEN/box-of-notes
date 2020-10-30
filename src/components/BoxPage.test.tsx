import { act, RenderResult } from "@testing-library/react";
import React from "react";
import IBox from "../models/Box";
import { renderInRouter } from "../testing";
import BoxPage from "./BoxPage";
import { history } from '../history'
import Firestore from "../utilities/database";
import { Urls } from "../types/urls";

const testBox: IBox = {
    id: 'testId',
    description: 'test',
    openingTime: new Date()
}

describe('BoxPage', () => {
    let wrapper: RenderResult
    beforeAll(() => {
        Firestore.prototype.getBox = jest.fn(async (id: string): Promise<IBox> => {
            return new Promise(resolve => resolve(testBox))
        })
    })

    beforeEach(() => {
        act(() => {
            wrapper = renderInRouter(< BoxPage />, Urls.BoxPage, { id: testBox.id! });
        })
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('should render the box with the passed id', () => {
        expect(history.location.pathname).toEqual(Urls.BoxPage({ id: testBox.id }))
        expect(Firestore.prototype.getBox).toHaveBeenCalledWith(testBox.id)
    })
})