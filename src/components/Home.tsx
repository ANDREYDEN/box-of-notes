import React from "react";
import { Link } from "react-router-dom";
import IBox from "../models/Box";
import { Urls } from "../types/urls";
import Firestore from "../utilities/database";
import BoxList from "./BoxList";

export interface HomeProps {

}

export interface HomeState {
    boxes: IBox[]
}

export default class Home extends React.Component<HomeProps, HomeState> {
    state: HomeState = {
        boxes: []
    }

    async componentDidMount() {
        const boxes = await Firestore.instance.getBoxes()
        this.setState({ boxes })
    }

    render() {
        return (
            <div>
                <h1>Box of Notes</h1>
                <Link to={Urls.NewBox}>Create Box</Link>
                <BoxList boxes={this.state.boxes} />
            </div>
        )
    }
}
