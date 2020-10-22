import React from "react"
import Box from "../models/Box"
import Firestore from "../utilities/database"

export default class BoxCreate extends React.Component {
    private box!: Box;

    createBox(event: React.FormEvent) {
        event.preventDefault()
        Firestore.instance.db.collection('boxes').add(this.box)
    }

    updateTime() {

    }

    render() {
        return (
            <div>
                <form className="container" onSubmit={this.createBox}>
                    <h1>New Box</h1>

                    <label htmlFor="time">Opening Time</label><br />
                    <input type="datetime-local" name="time" id="time" autoFocus onChange={this.updateTime} /><br />
                    <label htmlFor="details">Box Description</label><br />
                    <input type="text" name="details" id="details" /><br />
                    <input type="submit" value="Create Box" />
                    <a href="/" className="button">Back</a>
                </form>
            </div>
        )
    }
}