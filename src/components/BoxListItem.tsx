import React from "react";
import IBox from "../models/Box";

import { history } from '../history'
import ListItem from "@material-ui/core/ListItem";
import { ListItemText } from "@material-ui/core";

export interface BoxListItemProps {
    box: IBox
}

const BoxListItem: React.FunctionComponent<BoxListItemProps> = (props: BoxListItemProps) => {
    const forwardToBox = () => {
        history.push(`/box/${props.box.id}`)
    }

    return (
        <ListItem button onClick={forwardToBox} data-testid="box-item">
            <ListItemText
                primary={props.box.description}
                secondary={`Opening time: ${props.box.openingTime?.toString()}`}
            />
        </ListItem>
    );
}

export default BoxListItem;