import React from "react";
import { Link } from "react-router-dom";

export interface HomeProps {

}

export interface HomeState {

}

export default class Home extends React.Component<HomeProps, HomeState> {
    render() {
        return (
            <div>
                <h1>Box of Notes</h1>
                <Link to="/box">Create Box</Link>
                <h2>Your boxes:</h2>
                <ul>
                    <li>Box1</li>
                    <li>Box2</li>
                </ul>
            </div>
        )
    }
}
