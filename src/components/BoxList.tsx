import React from "react";
import IBox from "../models/Box";

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
                                <p>Description: {box.description}</p>
                                <p>Opening time: {box.openingTime?.toString()}</p>
                            </li>
                        )
                    })}
                </ul>
            </div>
        );
    }
}

export default BoxList;