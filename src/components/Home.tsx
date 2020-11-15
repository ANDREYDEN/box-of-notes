import React, { useEffect, useState } from "react";
import IBox from "../models/Box";
import { Urls } from "../types/urls";
import Firestore from "../utilities/database";
import BoxList from "./BoxList";

import firebase from '../firebase'
import { history } from '../history'
import { AppBar, Toolbar, Typography, Button, makeStyles, Theme, createStyles, Avatar } from "@material-ui/core";
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
    const [user, setUser] = useState<firebase.User | null>()
    const classes = useStyles()

    useEffect(() => {
        Firestore.instance.getBoxes().then(setBoxes)
        Auth.instance.onAuthStateChanged(user => {
            setUser(user)
        })
    }, [])


    const handleCreateBox = () => {
        history.push(Urls.NewBox)
    }

    const getAccountButton = () => {
        console.log(user);

        if (!user) {
            return <Button color="inherit" onClick={() => Auth.instance.signIn()}>Sign In</Button>
        }
        return <Avatar src={user.photoURL ?? ''} />
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Box of Notes
                    </Typography>
                    {getAccountButton()}
                </Toolbar>
            </AppBar>

            <Button color="primary" variant="outlined" onClick={handleCreateBox}>
                Create Box
            </Button>
            <BoxList boxes={boxes ?? []} />
        </div>
    )
}
