import React, { useEffect, useState } from "react";
import IBox from "../models/Box";
import { Urls } from "../types/urls";
import Firestore from "../utilities/database";
import BoxList from "./BoxList";

import firebase from '../firebase'
import { history } from '../history'
import { AppBar, Toolbar, Typography, Button, makeStyles, Theme, createStyles, Avatar, Menu, MenuItem, IconButton } from "@material-ui/core";
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
    const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement | null>(null)
    const [boxes, setBoxes] = useState<IBox[]>()
    const [user, setUser] = useState<firebase.User | null>(Auth.instance.user)
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

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorElement(event.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuAnchorElement(null);
    };

    const handleLogOut = () => {
        Auth.instance.signOut()
        handleMenuClose()
    }

    const getAccountButton = () => {
        console.log(user);

        if (!user) {
            return <Button color="inherit" onClick={() => Auth.instance.signIn()}>Sign In</Button>
        }
        return <IconButton onClick={handleAvatarClick}><Avatar src={user.photoURL ?? ''} /></IconButton>
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Box of Notes
                    </Typography>
                    {getAccountButton()}
                    <Menu
                        id="simple-menu"
                        anchorEl={menuAnchorElement}
                        keepMounted
                        open={Boolean(menuAnchorElement)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Button color="primary" variant="outlined" onClick={handleCreateBox}>
                Create Box
            </Button>
            <BoxList boxes={boxes ?? []} />
        </div>
    )
}
