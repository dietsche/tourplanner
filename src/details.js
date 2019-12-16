import React, { useState, useEffect } from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import DetailMap from "./detailMap";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import TrainIcon from "@material-ui/icons/Train";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import CircularProgress from "@material-ui/core/CircularProgress";

const DetailsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: calc(100vh - 50px);
    .exit {
        font-size: calc(26px + 1vw);
        position: absolute;
        left: calc(100vw - 30px);
    }
    .details-text {
        text-align: center;
        padding: 10px;
        h1 {
            font-size: 20px;
        }
        .distance-container {
            width: 100%;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            .distance-box {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 6px 10px;
                width: 60px;
                height: 30px;
                background-color: rgb(252, 252, 252);
                border: 1px #17053e dotted;
                border-radius: 3px;
                p {
                    font-size: 14px;
                    margin: 5px;
                }
            }
        }
    }
`;

export function Details({ filteredDestinations, selectedDestination, match }) {
    const [lat, setLat] = useState();
    const [long, setLong] = useState();
    const [
        filteredDestinationsinDetail,
        setFilteredDestinationsinDetail
    ] = useState([]);
    const [currentDestination, setCurrentDestination] = useState({});
    let id = match.params.id;

    console.log("ID: ", match.params.id);

    useEffect(() => {
        console.log("componentDidMount!");
        setFilteredDestinationsinDetail(filteredDestinations);
        id = match.params.id;
        setCurrentDestination(filteredDestinations.find(obj => obj.id == id));
        // return () => {
        //     console.log("unmount");
        //     id = null;
        //     setCurrentDesination({});
        // };
    }, [id]);

    function handleMarkerClick(id) {
        console.log("dest.id - showINfo: ", id);
        setCurrentDestination(filteredDestinations.find(obj => obj.id == id));
    }
    return (
        <>
            <DetailsContainer>
                <Link to={{ pathname: "/" }}>
                    <span className="exit">&times;</span>
                </Link>
                <div className="details-text">
                    <div className="distance-container">
                        {currentDestination.train && (
                            <div className="distance-box">
                                <TrainIcon style={{ width: 22 }} />
                                <p>{currentDestination.train}</p>
                            </div>
                        )}
                        {currentDestination.car && (
                            <div className="distance-box">
                                <DirectionsCarIcon style={{ width: 22 }} />
                                <p>{currentDestination.car}</p>
                            </div>
                        )}
                        {currentDestination.foot && (
                            <div className="distance-box">
                                <DirectionsWalkIcon style={{ width: 22 }} />
                                <p>{currentDestination.foot}</p>
                            </div>
                        )}
                        {currentDestination.bike && (
                            <div className="distance-box">
                                <DirectionsBikeIcon style={{ width: 22 }} />
                                <p>{currentDestination.bike}</p>
                            </div>
                        )}
                    </div>

                    <h1>{currentDestination.title}</h1>

                    <p>{currentDestination.description}</p>
                </div>
                <DetailMap
                    filteredDestinations={filteredDestinations}
                    currentDestination={currentDestination}
                    handleMarkerClick={handleMarkerClick}
                    id={id}
                ></DetailMap>
            </DetailsContainer>
        </>
    );
}
// <code>{JSON.stringify(match, null, 2)}</code>{" "}
