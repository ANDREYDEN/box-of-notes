import React from "react";
import IBox from "../models/Box";

import { history } from '../history'
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import { ListItemText } from "@material-ui/core";

export interface BoxListItemProps {
    box: IBox
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
        },
    }),
);

const BoxListItem: React.FunctionComponent<BoxListItemProps> = (props: BoxListItemProps) => {
    const classes = useStyles()
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