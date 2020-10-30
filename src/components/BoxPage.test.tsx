import { render, RenderResult } from "@testing-library/react";
import React from "react";
import IBox from "../models/Box";
import { renderInRouter } from "../testing";
import BoxPage from "./BoxPage";
import { history } from '../history'
import Firestore from "../utilities/database";
import { act } from "react-dom/test-utils";

const testBox: IBox = {
    id: 'testId',
    description: 'test',
    openingTime: new Date()
}

describe('BoxPage', () => {
    let wrapper: RenderResult
    beforeAll(() => {
        Firestore.prototype.getBox = jest.fn().mockResolvedValue(testBox)
    })

    beforeEach(() => {
        wrapper = renderInRouter(< BoxPage />, '/box/testId');
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it.todo('should render the box with the passed id')
})