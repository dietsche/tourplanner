import React, { useState, useEffect } from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import DetailMap from "./detailMap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export function Details({ filteredDestinations, match }) {
    const [lat, setLat] = useState();
    const [long, setLong] = useState();
    console.log("ID: ", match.params.id);
    const id = match.params.id;

    useEffect(() => {
        console.log("componentDidMount!");
        console.log("filteredDestinations: ", filteredDestinations);

        // (async () => {
        //     const { data } = await axios.get("/api/destinations");
        //     console.log("relevant data e.g.: ", data.destinationData[6]);
        //     setLat(data.destinationData[7].lat);
        //     setLong(data.destinationData[7].long);
        // })();
    }, [id]);

    return (
        <>
            <h1>{filteredDestinations[id - 1].title}</h1>
            <h1>X</h1>
            <p>
                <strong>Match Props: </strong>
                <code>{JSON.stringify(location)}</code>{" "}
            </p>
            <p>
                <strong>Location Props: </strong>
            </p>
            <div>Map: center on current location</div>
            <DetailMap
                filteredDestinations={filteredDestinations}
                id={id}
            ></DetailMap>
        </>
    );
}
// <code>{JSON.stringify(match, null, 2)}</code>{" "}
