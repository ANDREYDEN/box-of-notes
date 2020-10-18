import { render } from "@testing-library/react"
import React from "react"

export default class BoxCreate extends React.Component {
    render() {
        return (
            <div>
                <form action="/box/new" method="post">
                    <h1>New Box</h1>

                    <label htmlFor="time">Opening Time</label><br />
                    <input type="datetime-local" name="time" id="time" autoFocus /><br />
                    <label htmlFor="details">Box Description</label><br />
                    <input type="text" name="details" id="details" /><br />
                    <input type="submit" value="Create Box" />
                    <a href="/" className="button">Back</a>
                </form>
            </div>
        )
    }
}