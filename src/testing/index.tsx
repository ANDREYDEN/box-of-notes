import { render, RenderResult } from "@testing-library/react";
import React from "react";
import { Route, Router } from "react-router-dom";
import { history } from '../history';

type RouteFunction = (params?: any) => string

export const renderInRouter = (
    Comp: JSX.Element,
    route: string | RouteFunction,
    params?: any
): RenderResult => {
    const routeFn: RouteFunction = typeof (route) === 'string' ? (() => route) : route

    const result: RenderResult = render(
        <Router history={history}>
            <Route path={routeFn()}>
                {Comp}
            </Route>
        </Router>
    );
    history.push(routeFn(params))
    return result
};
