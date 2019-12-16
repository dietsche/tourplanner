import React from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import TrainIcon from "@material-ui/icons/Train";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";

const Card = styled.div`
    box-sizing: border-box;
    width: 45vw;
    min-width: 170px;
    height: 42vw;
    min-height: 160px;
    @media (max-width: 350px) {
        width: 90vw;
        height: 50vw;
    }
    @media (min-width: 350px) {
        max-width: 210px;
        max-height: 200px;
    }
    margin: 1vw;
    box-shadow: 1px 1px 3px rgb(100, 100, 100);
    border: 1px rgb(220, 220, 220) dotted;
    border-radius: 3px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    .type-bar {
        height: 12px;
        width: 100%;
        background-color: rgb(41, 84, 110);
    }

    .title {
        font-size: calc(12px + 0.35vw);
        @media (min-width: 800px) {
            font-size: 16px;
        }
        color: rgb(244, 244, 244);
        background-color: rgb(238, 56, 64);
        padding: 2px 5px;
        font-weight: bold;
        text-align: center;
        margin: calc(3px + 0.5vw) 12px 0 12px;
    }
    .description {
        font-size: calc(10px + 0.3vw);
        color: #17053e;
        text-align: center;
        margin: 2px 12px;
        text-align: center;
    }
    .distance-container {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        .distance-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 6px 4px;
            width: 34px;
            height: 38px;
            background-color: white;
            border: 1px #17053e dotted;
            border-radius: 3px;
            p {
                font-size: 11px;
                margin: 0;
            }
        }
    }
`;

export default function ResultCard(props) {
    let descriptionPreview = props.description;
    let lengthPreview = 3 + document.documentElement.clientWidth / 150;
    let indices = [];
    for (let i = 0; i < descriptionPreview.length; i++) {
        if (descriptionPreview[i] === " ") indices.push(i);
    }
    console.log(indices.length);
    if (indices.length > lengthPreview) {
        for (let i = 0; i < indices.length - lengthPreview; i++) {
            let res = descriptionPreview.split(" "); //split by space
            res.pop(); //remove last element
            descriptionPreview = res.join(" ") + " [...]";
        }
    }
    console.log("descriptionPreview: ", descriptionPreview);

    return (
        <Card>
            <div className="type-bar"></div>
            <div className="distance-container">
                {props.train && (
                    <div className="distance-box">
                        <TrainIcon style={{ width: 15 }} />
                        <p>{props.train}</p>
                    </div>
                )}
                {props.car && (
                    <div className="distance-box">
                        <DirectionsCarIcon style={{ width: 15 }} />
                        <p>{props.car}</p>
                    </div>
                )}
                {props.foot && (
                    <div className="distance-box">
                        <DirectionsWalkIcon style={{ width: 15 }} />
                        <p>{props.foot}</p>
                    </div>
                )}
                {props.bike && (
                    <div className="distance-box">
                        <DirectionsBikeIcon style={{ width: 15 }} />
                        <p>{props.bike}</p>
                    </div>
                )}
            </div>

            <h2 className="title">{props.title}</h2>
            <div className="description">
                <p>{descriptionPreview}</p>
            </div>
        </Card>
    );
}
