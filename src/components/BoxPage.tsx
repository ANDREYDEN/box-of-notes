import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import IBox from "../models/Box";
import Firestore from "../utilities/database";
import BoxListItem from "./BoxListItem";

export interface BoxPageParams {
    id: string
}

export const BoxPage: React.FC = () => {
    const { id } = useParams<BoxPageParams>()
    const [box, setBox] = useState<IBox>({})

    useEffect(() => {
        Firestore.instance.getBox(id).then(setBox)
    }, [id])

    if (!box) {
        return (<div>Loading...</div>)
    }

    return (<BoxListItem box={box} />);
}

export default BoxPage;