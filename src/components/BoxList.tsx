import { Card, Container, List, ListSubheader } from "@material-ui/core";
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
            <Card variant="outlined">
                <ListSubheader>Your boxes:</ListSubheader>
                <List>
                    {this.props.boxes.map(box => {
                        return (
                            <BoxListItem box={box} key={box.id} />
                        )
                    })}
                </List>
            </Card>
        );
    }
}

export default BoxList;