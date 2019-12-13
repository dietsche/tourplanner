import React from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import TrainIcon from "@material-ui/icons/Train";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";

const Card = styled.div`
    width: 45vw;
    min-widht: 170px;
    max-width: 210px;
    height: 42vw;
    min-height: 160px;
    max-height: 200px;
    margin: 2vw;
    box-shadow: 1px 1px 3px;
    border-radius: 3px;
    background-color: rgb(255, 241, 198);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    .title {
        font-size: calc(13px + 0.2vw);
        font-weight: bold;
        margin: calc(5px + 0.5vw) 12px 5px 12px;
    }
    .description {
        font-size: calc(12px + 0.15vw);
        margin: 5px 12px;
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
            background-color: rgb(252, 252, 252);
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
