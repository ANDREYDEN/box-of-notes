import { render } from "@testing-library/react";
import React from "react";
import { Router } from "react-router-dom";
import { history } from '../history';

export const renderInRouter = (Comp: React.FC) => {
    return render(
        <Router history={history}>
            <Comp />
        </Router>
    );
};
