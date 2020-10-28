import React, { FunctionComponent, useState } from "react"
import { useHistory } from "react-router"
import IBox from "../models/Box"
import { Urls } from "../types/urls"
import Firestore from "../utilities/database"

interface BoxCreateState {
    box: IBox | null
}

interface BoxProps {

}

export const BoxCreate: FunctionComponent<BoxProps> = (props: BoxProps) => {
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
            <form className="container" onSubmit={createBox}>
                <h1>New Box</h1>

                <label htmlFor="time">Opening Time</label>
                <input type="datetime-local" name="time" id="time" autoFocus
                    onChange={updateTime}
                /><br />

                <label htmlFor="details">Description</label>
                <input type="text" name="details" id="details"
                    onChange={updateDescription}
                /><br />

                <input type="submit" value="Create Box" />
                <a href="/" className="button">Back</a>
            </form>
        </div>
    )
}