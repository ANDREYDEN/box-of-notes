import React from "react"
import IBox from "../models/Box"
import Firestore from "../utilities/database"

interface BoxCreateState {
    box: IBox
}

export default class BoxCreate extends React.Component<any, BoxCreateState> {
    constructor(props: any) {
        super(props)
        this.state = {
            box: {}
        }
    }

    private box!: IBox;

    createBox = (event: React.FormEvent) => {
        event.preventDefault()
        debugger
        Firestore.instance.createBox(this.state.box);
    }

    updateTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            box: {
                ...this.state.box, openingTime: new Date(event.target.value ?? Date.now())
            }
        })
    }

    updateDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        debugger
        this.setState({
            box: {
                ...this.state.box, description: event.target.value ?? ""
            }
        })
    }

    render() {
        return (
            <div>
                <form className="container" onSubmit={this.createBox}>
                    <h1>New Box</h1>

                    <label htmlFor="time">Opening Time</label>
                    <input type="datetime-local" name="time" id="time" autoFocus
                        onChange={this.updateTime}
                    /><br />

                    <label htmlFor="details">Description</label>
                    <input type="text" name="details" id="details"
                        onChange={this.updateDescription}
                    /><br />

                    <input type="submit" value="Create Box" />
                    <a href="/" className="button">Back</a>
                </form>
            </div>
        )
    }
}