import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import Box from "@material-ui/core/Box";
import NoSsr from "@material-ui/core/NoSsr";
import {
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    FormLabel,
    Input,
    InputAdornment
} from "@material-ui/core";
import { StylesProvider } from "@material-ui/styles";
import TrainIcon from "@material-ui/icons/Train";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import TestMap from "./maps";
import { Map } from "./maps";

const BackgroundLayer = styled.div`
    display: flex;
    justify-content: center;
    background-color: rgb(220, 220, 220);
    min-height: calc(100vh - 25px);
`;
const AddCardContainer = styled.div`
    max-width: 600px;
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    background-color: white;
    color: rgb(41, 84, 110);
    .exit {
        font-size: calc(26px + 1vw);
        position: absolute;
        left: calc(100vw - 30px);
        color: rgb(41, 84, 110);
    }
    h1 {
        width: 100%;
        font-size: 16px;
        margin-bottom: 0;
        margin-left: 5px;
    }
    h2 {
        width: 100%;
        font-size: 13px;
        margin-left: 5px;
    }

    input {
        margin: 10px 7px;
        padding: 5px;
        border-radius: 3px;
        height: 22px;
        font-size: 14px;
    }

    .description {
        width: 90%;
    }

    .street {
        width: 60%;
    }
    .nr {
        width: 20%;
    }
    .zip {
        width: 30%;
    }
    .city {
        width: 50%;
    }
    .distance {
        width: 85px;
        margin-right: 4%;
    }
    img {
        width: 17px;
        margin-right: 7px;
    }
    > button {
        margin: auto;
    }
    .on-click {
        cursor: pointer;
        color: rgb(238, 56, 64);
        text-decoration: underline;
    }
    .coordinates-saved {
        color: green;
    }
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    margin: auto 10px;
`;

const ContainerWeather = styled.div`
    display: flex;
    flex-wrap: wrap;
    .weatherIcon {
        width: 30px;
    }
`;

export default function AddCard() {
    const [state, setState] = useState({
        norain: true,
        rain: true,
        hot: true,
        cold: true
    });
    const [mapView, setMapView] = useState(false);
    const [locationSuccess, setLocationSuccess] = useState(false);
    let currentInput = {};

    function changeWeather(str) {
        setState({ ...state, [str]: event.target.checked });

        // if (str == "norain") {
        //     norain ? setNorain(false) : setNorain(true);
        // } else if (str == "rain") {
        //     rain ? setRain(false) : setRain(true);
        // } else if (str == "bike") {
        //     bike ? setBike(false) : setBike(true);
        // } else if (str == "foot") {
        //     foot ? setFoot(false) : setFoot(true);
    }

    function handleChange(inputElement) {
        inputElement.preventDefault();
        setState({
            ...state,
            [inputElement.target.name]: inputElement.target.value
        });

        // currentInput = {
        //     ...currentInput,
        //     [inputElement.target.name]: inputElement.target.value
        // };
        // console.log("input obj: ", inputs, inputs.title, inputs.description);
    }
    function submit() {
        console.log("input.title: ", currentInput.title);
        console.log("state ", state);
        const {
            title,
            description,
            street,
            nr,
            zip,
            city,
            lat,
            long,
            car,
            train,
            bike,
            foot,
            norain,
            rain,
            hot,
            cold
        } = state;
        console.log("klapp refacturing:?= ", title, description);

        axios
            .post("/add-destination", {
                title: title,
                description: description,
                street: street,
                nr: nr,
                zip: zip,
                city: city,
                lat: lat,
                long: long,
                car: car,
                train: train,
                bike: bike,
                foot: foot,
                norain: norain,
                rain: rain,
                hot: hot,
                cold: cold
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("data", data);
                    location.replace("/"); //replace> page in history is replaced in history > you cant go back in browser!!!!
                } else {
                    setState({
                        error: true
                    });
                }
            });
    }

    function changeMapView() {
        setMapView(true);
    }

    async function changeDistanceMode(mode) {
        console.log("lat ling in function???: ", state.lat, state.long);
        let response = await axios.post("/calculate-distance", {
            latitude: state.lat,
            longitude: state.long,
            mode: mode
        });
        console.log("time in min : ", Math.round(response.data.bike / 60));
        let min = Math.round(response.data.mode / 60);
        mode == "bicycling" &&
            setState({
                ...state,
                bike: min
            });
        mode == "walking" &&
            setState({
                ...state,
                foot: min
            });
        mode == "driving" &&
            setState({
                ...state,
                car: min
            });
        mode == "transit" &&
            setState({
                ...state,
                train: min
            });
        console.log(response);
    }

    function onPositionChange(lat, long) {
        console.log("coordinates received!!?: ", lat, long);
        setState({
            ...state,
            lat: lat,
            long: long
        });
        // setMapView(false);
        setLocationSuccess(true);
    }

    useEffect(() => {
        console.log("componentDidMount!");
    }, []);

    return (
        <BackgroundLayer>
            <AddCardContainer>
                <Link to={{ pathname: "/" }}>
                    <span className="exit">&times;</span>
                </Link>

                <h1>Add Destination</h1>
                <input
                    required
                    type="text"
                    className="title"
                    placeholder="Title"
                    name="title"
                    onChange={e => handleChange(e)}
                />
                <input
                    className="description"
                    type="text"
                    placeholder="Description"
                    fullwidth
                    name="description"
                    onChange={e => handleChange(e)}
                />
                {!locationSuccess && (
                    <h2>
                        Enter Address or{" "}
                        <span className="on-click" onClick={changeMapView}>
                            locate on map
                        </span>
                    </h2>
                )}
                {!mapView && !locationSuccess && (
                    <div>
                        {" "}
                        <input
                            className="street"
                            placeholder="Street"
                            name="street"
                            onChange={e => handleChange(e)}
                        />
                        <input
                            className="nr"
                            placeholder="No."
                            name="nr"
                            onChange={e => handleChange(e)}
                        />
                        <input
                            className="zip"
                            placeholder="ZIP Code"
                            name="zip"
                            onChange={e => handleChange(e)}
                        />
                        <input
                            className="city"
                            placeholder="City"
                            name="city"
                            onChange={e => handleChange(e)}
                        />{" "}
                    </div>
                )}
                {mapView && (
                    <div>
                        <TestMap onPositionChange={onPositionChange}></TestMap>
                    </div>
                )}

                {locationSuccess && (
                    <h2 className="coordinates-saved">
                        {" "}
                        Coordinates are saved!
                    </h2>
                )}

                <h2>Distance: enter or calculate (by clicking on icons)</h2>
                <CheckboxWrapper>
                    <Input
                        id="outlined"
                        style={{ width: 120 }}
                        value={state.car}
                        startAdornment={
                            <InputAdornment position="start">
                                <DirectionsCarIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        changeDistanceMode("driving")
                                    }
                                />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">min</InputAdornment>
                        }
                        name="car"
                        onChange={e => handleChange(e)}
                    />
                </CheckboxWrapper>
                <CheckboxWrapper>
                    <Input
                        id="outlined"
                        style={{ width: 120 }}
                        value={state.train}
                        startAdornment={
                            <InputAdornment position="start">
                                <TrainIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        changeDistanceMode("transit")
                                    }
                                />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">min</InputAdornment>
                        }
                        name="train"
                        onChange={e => handleChange(e)}
                    />
                </CheckboxWrapper>
                <CheckboxWrapper>
                    <Input
                        id="outlined"
                        style={{ width: 120 }}
                        value={state.bike}
                        startAdornment={
                            <InputAdornment position="start">
                                <DirectionsBikeIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        changeDistanceMode("bicycling")
                                    }
                                />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">min</InputAdornment>
                        }
                        name="bike"
                        onChange={e => handleChange(e)}
                    />
                </CheckboxWrapper>
                <CheckboxWrapper>
                    <Input
                        id="outlined"
                        style={{ width: 120 }}
                        value={state.foot}
                        startAdornment={
                            <InputAdornment position="start">
                                <DirectionsWalkIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        changeDistanceMode("walking")
                                    }
                                />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">min</InputAdornment>
                        }
                        name="foot"
                        onChange={e => handleChange(e)}
                    />
                </CheckboxWrapper>
                <h2>Weather</h2>
                <ContainerWeather>
                    <CheckboxWrapper>
                        <Checkbox
                            checked={state.norain}
                            color="default"
                            onClick={() => changeWeather("norain")}
                        />
                        <img src="/img/sun.png" className="weatherIcon" />
                    </CheckboxWrapper>
                    <CheckboxWrapper>
                        <Checkbox
                            checked={state.rain}
                            color="default"
                            onClick={() => changeWeather("rain")}
                        />

                        <img src="/img/rain.png" className="weatherIcon" />
                    </CheckboxWrapper>
                    <CheckboxWrapper>
                        <Checkbox
                            checked={state.hot}
                            color="default"
                            onClick={() => changeWeather("hot")}
                            // onChange={handleChange("gilad")}
                        />

                        <img src="/img/hot.png" className="weatherIcon" />
                    </CheckboxWrapper>
                    <CheckboxWrapper>
                        <Checkbox
                            checked={state.cold}
                            color="default"
                            onClick={() => changeWeather("cold")}
                        />

                        <img src="/img/cold.png" className="weatherIcon" />
                    </CheckboxWrapper>
                </ContainerWeather>
                <h2></h2>
                <Button
                    variant="outlined"
                    style={{
                        backgroundColor: "rgb(238, 56, 64)",
                        color: "white"
                    }}
                    onClick={() => submit()}
                >
                    Save
                </Button>
            </AddCardContainer>
        </BackgroundLayer>
    );
}
