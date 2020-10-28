import React from "react";
import IBox from "../models/Box";

export interface BoxListItemProps {
    box: IBox
}

const BoxListItem: React.FunctionComponent<BoxListItemProps> = (props: BoxListItemProps) => {
    return (
        <div>
            <p>Description: {props.box.description}</p>
            <p>Opening time: {props.box.openingTime?.toString()}</p>
        </div>
    );
}

export default BoxListItem;