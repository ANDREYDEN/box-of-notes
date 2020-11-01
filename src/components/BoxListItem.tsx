import React from "react";
import IBox from "../models/Box";

import { history } from '../history'
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
        <Card className={classes.root} variant="outlined" onClick={forwardToBox} data-testid="box-item">
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Opening time: {props.box.openingTime?.toString()}
                </Typography>
                <Typography variant="h5" component="h2">
                    {props.box.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}

export default BoxListItem;