import { render, RenderResult } from "@testing-library/react";
import React from "react";
import { Router } from "react-router-dom";
import { history } from '../history';

export const renderInRouter = (Comp: JSX.Element, route: string = ''): RenderResult => {
    const result: RenderResult = render(
        <Router history={history}>
            {Comp}
        </Router>
    );
    if (route !== '') {
        history.push(route)
    }
    return result
};
