import { RenderResult } from "@testing-library/react"
import { history } from '../history'
import { Urls } from "../types/urls"
import { Home } from "./Home"
import { renderInRouter } from "../testing"

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