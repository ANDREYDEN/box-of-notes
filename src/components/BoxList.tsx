import React from "react";
import IBox from "../models/Box";
import BoxListItem from "./BoxListItem";

export interface BoxListProps {
    boxes: IBox[]
}

export interface BoxListState {
}

class BoxList extends React.Component<BoxListProps, BoxListState> {
    render() {
        return (
            <div>
                <h2>Your boxes:</h2>
                <ul>
                    {this.props.boxes.map(box => {
                        return (
                            <li key={box.id} data-testid="box-item">
                                <BoxListItem box={box} />
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }
}

export default BoxList;