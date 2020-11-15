import React, { useEffect, useState } from "react";
import IBox from "../models/Box";
import { Urls } from "../types/urls";
import Firestore from "../utilities/database";
import BoxList from "./BoxList";

import { history } from '../history'
import { AppBar, Toolbar, Typography, Button, makeStyles, Theme, createStyles } from "@material-ui/core";
import Auth from "../utilities/auth";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

export const Home: React.FC = () => {
    const [boxes, setBoxes] = useState<IBox[]>()
    const classes = useStyles()

    useEffect(() => {
        Firestore.instance.getBoxes().then(setBoxes)
    }, [])

    const handleCreateBox = () => {
        history.push(Urls.NewBox)
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Box of Notes
                    </Typography>
                    <Button color="inherit" onClick={() => Auth.instance.signIn()}>Sign In</Button>
                </Toolbar>
            </AppBar>

            <Button color="primary" variant="outlined" onClick={handleCreateBox}>
                Create Box
            </Button>
            <BoxList boxes={boxes ?? []} />
        </div>
    )
}
