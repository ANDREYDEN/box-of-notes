import React from "react";
import IBox from "../models/Box";

import { history } from '../history'

export interface BoxListItemProps {
    box: IBox
}

const BoxListItem: React.FunctionComponent<BoxListItemProps> = (props: BoxListItemProps) => {
    const forwardToBox = () => {
        history.push(`/box/${props.box.id}`)
    }

    return (
        <div onClick={forwardToBox}>
            <p>Description: {props.box.description}</p>
            <p>Opening time: {props.box.openingTime?.toString()}</p>
        </div>
    );
}

export default BoxListItem;