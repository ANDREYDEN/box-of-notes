import { render, RenderResult } from "@testing-library/react"
import React from "react"
import { Router } from "react-router-dom"
import { history } from '../history'
import { Urls } from "../types/urls"
import { Home } from "./Home"

const renderInRouter = (Comp: React.FC) => {
    return render(
        <Router history={history}>
            <Comp />
        </Router>
    )
}
describe('Home', () => {
    let wrapper: RenderResult

    beforeEach(() => {
        wrapper = renderInRouter(Home);
        history.push(Urls.Home)
    })

    afterEach(() => {
        wrapper.unmount()
    })


    it('has a link to the box creation page', () => {
        const linkElement: HTMLElement = wrapper.getByText(/[Cc]reate [Bb]ox/g);

        expect(linkElement).toBeInTheDocument();
        expect(linkElement.getAttribute('href')).toEqual(Urls.NewBox);
    });
})