import { RenderResult } from "@testing-library/react"
import { history } from '../history'
import { Urls } from "../types/urls"
import { Home } from "./Home"
import { renderInRouter } from "../testing"
import React from "react"

describe('Home', () => {
    let wrapper: RenderResult

    beforeEach(() => {
        wrapper = renderInRouter(<Home />, Urls.Home)
    })

    afterEach(() => {
        wrapper.unmount()
    })


    it.skip('has a link to the box creation page', () => {
        const linkElement: HTMLElement = wrapper.getByText(/[Cc]reate [Bb]ox/g);

        expect(linkElement).toBeInTheDocument();
        expect(linkElement.getAttribute('href')).toEqual(Urls.NewBox);
    });
})