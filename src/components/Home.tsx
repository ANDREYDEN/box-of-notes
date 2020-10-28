import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IBox from "../models/Box";
import { Urls } from "../types/urls";
import Firestore from "../utilities/database";
import BoxList from "./BoxList";

export const Home: React.FC = () => {
    const [boxes, setBoxes] = useState<IBox[]>()

    useEffect(() => {
        Firestore.instance.getBoxes().then(setBoxes)
    }, [])

    return (
        <div>
            <h1>Box of Notes</h1>
            <Link to={Urls.NewBox}>Create Box</Link>
            <BoxList boxes={boxes ?? []} />
        </div>
    )
}
