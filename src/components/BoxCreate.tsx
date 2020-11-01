import Button from "@material-ui/core/Button"
import Link from "@material-ui/core/Link"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import React, { FunctionComponent, useState } from "react"
import { useHistory } from "react-router"
import IBox from "../models/Box"
import { Urls } from "../types/urls"
import Firestore from "../utilities/database"

interface BoxCreateState {
    box: IBox | null
}

interface BoxProps { }

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 0
        },
        textField: {
            margin: theme.spacing(1),
            width: '25vw',
        },
    }),
);

export const BoxCreate: FunctionComponent<BoxProps> = (props: BoxProps) => {
    const classes = useStyles()
    const [state, setState] = useState<BoxCreateState>()
    const history = useHistory()
    const defaultState: BoxCreateState = {
        box: {}
    }
    if (!state) {
        setState(defaultState)
        return (<div></div>)
    }

    const createBox = async (event: React.FormEvent) => {
        event.preventDefault()

        if (state.box) {
            await Firestore.instance.createBox(state.box);
            history.push(Urls.Home)
        }
    }

    const updateTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            box: {
                ...state.box, openingTime: new Date(event.target.value ?? Date.now())
            }
        })
    }

    const updateDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            box: {
                ...state.box, description: event.target.value ?? ""
            }
        })
    }

    return (
        <div>
            <form onSubmit={createBox} className={classes.root}>
                <Typography variant="h4">New Box</Typography>

                <TextField type="text" label="Description" name="details" id="details" className={classes.textField}
                    variant="outlined" multiline autoFocus required
                    onChange={updateDescription} />
                <TextField type="datetime-local" label="Opening Time" name="time" id="time" className={classes.textField}
                    variant="outlined" required
                    onChange={updateTime}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <Button variant="contained" type="submit">Create Box</Button>
                <Link href="/">Back</Link>
            </form>
        </div>
    )
}