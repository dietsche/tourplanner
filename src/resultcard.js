import React from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import TrainIcon from "@material-ui/icons/Train";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import StarIcon from "@material-ui/icons/Star";

const Card = styled.div`
    box-sizing: border-box;
    width: 45vw;
    min-width: 175px;
    height: 42vw;
    min-height: 165px;
    @media (max-width: 362px) {
        width: 90vw;
        height: 50vw;
    }
    @media (min-width: 362px) {
        max-width: 210px;
        max-height: 200px;
    }
    margin: 1vw;
    /* background-image: linear-gradient(
        rgb(238, 56, 64),
        rgb(238, 56, 64),
        white,
        white,
        white,
        white,
        white,
        white
    ); */
    box-shadow: 1px 1px 3px rgb(100, 100, 100);
    /* border: 1px rgb(220, 220, 220) dotted; */
    border-radius: 3px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    .type-bar {
        height: 51.6px;
        width: 100%;
        margin-bottom: 18px;
        background-color: rgb(41, 84, 110);
    }

    .title {
        position: relative;
        height: 37px;
        max-height: 37px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2px 5px;
        margin: 1.5vw 12px 1vw 12px;
        @media (min-width: 800px) {
            margin: 10px 12px 12px 12px;
        }
        h2 {
            text-transform: uppercase;
            font-size: calc(12px + 0.35vw);
            font-weight: bold;
            color: rgb(238, 56, 64);
            margin-bottom: 0;
            @media (min-width: 800px) {
                font-size: 15px;
            }
            @media (min-width: 350px) and (max-width: 440px) {
                font-size: calc(11px + 0.35vw);
            }
        }
    }
    .description {
        display: flex;
        align-items: start;
        justify-content: center;
        p {
            font-size: calc(9.5px + 0.3vw);
            color: black;
            margin-top: calc(5px + 0.5vw);
            @media (min-width: 800px) {
                font-size: 12px;
                margin-top: 0;
            }
        }
        margin: 0 12px;
        text-align: center;
    }
    .distance-container {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: -14px;
        .distance-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 6px calc(1px + 0.5vw);
            @media (min-width: 800px) {
                margin: 6px 5px;
            }
            width: 34px;
            height: 38px;
            background-color: white;
            /* border: 1px #17053e dotted; */
            border: 2px rgb(41, 84, 110) solid;
            border-radius: 3px;
            p {
                font-size: 11px;
                margin: 0;
            }
        }
    }
`;

export default function ResultCard(props) {
    console.log("props: ", props);
    let descriptionPreview = props.description;
    let lengthPreview = 2 + document.documentElement.clientWidth / 200;
    let indices = [];
    for (let i = 0; i < descriptionPreview.length; i++) {
        if (descriptionPreview[i] === " ") {
            indices.push(i);
        }
    }
    console.log(indices.length);
    if (indices.length > lengthPreview && props.description.length > 40) {
        let res;
        for (let i = 0; i < indices.length - lengthPreview; i++) {
            res = descriptionPreview.split(" "); //split by space
            console.log("res for i: ", i, res);
            res.pop(); //remove last element
            descriptionPreview = res.join(" ");
        }
        descriptionPreview = res.join(" ") + " [...]";
    }
    console.log("descriptionPreview: ", descriptionPreview);

    return (
        <Card>
            <div className="type-bar">
                {props.favourite && (
                    <StarIcon style={{ color: "rgb(255,204,0)", margin: 5 }} />
                )}
                {!props.favourite && (
                    <StarIcon
                        style={{ color: "rgb(220,220,220)", margin: 5 }}
                    />
                )}
                <div className="distance-container">
                    {props.train && props.distance >= props.train && (
                        <div className="distance-box">
                            <TrainIcon style={{ width: 15 }} />
                            <p>{props.train}</p>
                        </div>
                    )}
                    {props.car && props.distance >= props.car && (
                        <div className="distance-box">
                            <DirectionsCarIcon style={{ width: 15 }} />
                            <p>{props.car}</p>
                        </div>
                    )}
                    {props.foot && props.distance >= props.foot && (
                        <div className="distance-box">
                            <DirectionsWalkIcon style={{ width: 15 }} />
                            <p>{props.foot}</p>
                        </div>
                    )}
                    {props.bike && props.distance >= props.bike && (
                        <div className="distance-box">
                            <DirectionsBikeIcon style={{ width: 15 }} />
                            <p>{props.bike}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="title">
                <h2>{props.title}</h2>
            </div>{" "}
            <div className="description">
                <p>{descriptionPreview}</p>
            </div>
        </Card>
    );
}
