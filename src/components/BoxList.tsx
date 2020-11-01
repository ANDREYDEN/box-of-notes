import { Container } from "@material-ui/core";
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
                <Container>
                    {this.props.boxes.map(box => {
                        return (
                            <BoxListItem box={box} key={box.id} />
                        )
                    })}
                </Container>
            </div>
        );
    }
}

export default BoxList;