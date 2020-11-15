import { fireEvent, RenderResult } from "@testing-library/react"
import { history } from '../history'
import { Urls } from "../types/urls"
import { Home } from "./Home"
import { renderInRouter } from "../testing"
import React from "react"
import Auth from "../utilities/auth"

describe('Home', () => {
    let wrapper: RenderResult

    beforeEach(() => {
        wrapper = renderInRouter(<Home />, Urls.Home)
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('signs in', () => {
        Auth.instance.signIn = jest.fn().mockResolvedValue({})
        const signInButton: HTMLElement = wrapper.getByText(/[Ss]ign [Ii]n/g)

        fireEvent.click(signInButton)

        expect(Auth.instance.signIn).toHaveBeenCalled()
    })
})