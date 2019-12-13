import React, { useState, useEffect } from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import DetailMap from "./detailMap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    .exit {
        font-size: calc(20px + 1vw);
        position: absolute;
        left: calc(100vw - 30px);
    }
`;

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
            <DetailsContainer>
                <span className="exit">&times;</span>
                <h1>{filteredDestinations[id - 1].title}</h1>

                <p>{filteredDestinations[id - 1].description}</p>
                <DetailMap
                    filteredDestinations={filteredDestinations}
                    id={id}
                ></DetailMap>
            </DetailsContainer>
        </>
    );
}
// <code>{JSON.stringify(match, null, 2)}</code>{" "}
