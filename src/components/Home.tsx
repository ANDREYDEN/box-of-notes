import React, { useState } from "react";
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

export const Home: React.FC = () => {
    const [state, setState] = useState<HomeState>()

    if (!state) {
        setState({
            boxes: []
        })
        return (<div></div>)
    }

    async function componentDidMount() {
        const boxes = await Firestore.instance.getBoxes()
        setState({ boxes })
    }

    return (
        <div>
            <h1>Box of Notes</h1>
            <Link to={Urls.NewBox}>Create Box</Link>
            <BoxList boxes={state.boxes} />
        </div>
    )
}
