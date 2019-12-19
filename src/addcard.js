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
    .title {
        width: 50%;
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
    button {
        margin: 20px auto;
    }
    .on-click {
        cursor: pointer;
        color: rgb(238, 56, 64);
        text-decoration: underline;
    }
    .map-text {
        margin-top: 0;
    }
    .saved {
        color: green;
    }
    .instructions {
        color: rgb(238, 56, 64);
    }
    .error {
        font-size: 14px;
        width: 100%;
        color: red;
        text-align: center;
        margin-bottom: -10px;
    }
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    margin: auto calc(5px + 1vw);
`;

const ContainerWeather = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .weatherIcon {
        width: 30px;
    }
`;

export default function AddCard({ userLat, userLong }) {
    const [state, setState] = useState({
        norain: true,
        rain: true,
        hot: true,
        cold: true
    });
    const [mapView, setMapView] = useState(false);
    const [locationSuccess, setLocationSuccess] = useState(false);
    const [error, setError] = useState(false);

    function changeWeather(str) {
        console.log(event.target.checked);
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
        console.log("inputElement.target.value: ", inputElement.target.value);
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
        console.log("state ", state);
        let {
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
        console.log("hallo");
        // if (car === "" || isNaN(car)) {
        //     affacar = null;
        // }
        // if (train === "" || isNaN(train)) {
        //     train = null;
        // }
        // if (bike === "" || isNaN(bike)) {
        //     bike = null;
        // }
        // if (foot === "" || isNaN(foot)) {
        //     foot = null;
        // }
        //
        console.log(
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
        );
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
                    setError(true);
                }
            });
    }

    function changeMapView() {
        setMapView(true);
    }

    async function calculateDistance() {
        try {
            console.log("lat ling in function???: ", state.lat, state.long);
            let response = await axios.post("/calculate-distance", {
                latitude: state.lat,
                longitude: state.long,
                userLat: userLat,
                userLong: userLong,
                street: state.street,
                nr: state.nr,
                zip: state.zip,
                city: state.city
            });
            console.log("RESPONSE: ", response.data.time);
            let car = Math.round(response.data.time[0] / 60);
            let train = Math.round(response.data.time[1] / 60);
            let bike = Math.round(response.data.time[2] / 60);
            let foot = Math.round(response.data.time[3] / 60);
            if (isNaN(response.data.time[0])) {
                car = null;
            }
            if (isNaN(response.data.time[1])) {
                train = null;
            }
            if (isNaN(response.data.time[2]) || bike > 120) {
                bike = null;
            }
            if (isNaN(response.data.time[3]) || foot > 60) {
                foot = null;
            }
            setState({
                ...state,
                car: car,
                train: train,
                bike: bike,
                foot: foot
            });

            // if (!isNaN(response.data.time[0]) && response.data.time[0] > 0) {
            // setState({
            //     ...state
            // });
            // }
            // if (!isNaN(response.data.time[1]) && response.data.time[1] > 0) {
            // setState({
            //     ...state
            // });
            // }
            // if (
            //     !isNaN(response.data.time[2]) &&
            //     response.data.time[2] > 0 &&
            //     response.data.time[2] / 60 < 180
            // ) {
            //     setState({
            //         ...state
            //     });
            // }
        } catch (err) {
            console.log(err);
        }
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
        console.log("userLATLONG???", userLat, userLong);
    }, [userLat, userLong]);

    return (
        <BackgroundLayer>
            <AddCardContainer>
                <Link to={{ pathname: "/" }}>
                    <span className="exit">&times;</span>
                </Link>
                <h1>Add destination</h1>
                <input
                    required
                    type="text"
                    className="title"
                    placeholder="Title"
                    name="title"
                    maxLength="30"
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
                <h2>
                    Enter address or{" "}
                    <span className="on-click" onClick={changeMapView}>
                        locate on map
                    </span>
                </h2>
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
                {mapView && locationSuccess && (
                    <h2 className="saved map-text"> Coordinates saved!</h2>
                )}{" "}
                {mapView && !locationSuccess && (
                    <h2 className="instructions map-text">
                        {" "}
                        Drag marker to position and doubleclick.
                    </h2>
                )}
                {mapView && (
                    <div>
                        <TestMap
                            userLat={userLat}
                            userLong={userLong}
                            onPositionChange={onPositionChange}
                        ></TestMap>
                    </div>
                )}
                <h2>
                    <span className="on-click" onClick={calculateDistance}>
                        Calculate Distance
                    </span>{" "}
                </h2>
                <CheckboxWrapper>
                    <Input
                        id="outlined"
                        style={{ width: 100 }}
                        value={state.car}
                        startAdornment={
                            <InputAdornment
                                style={{ margin: 0 }}
                                position="start"
                            >
                                <DirectionsCarIcon
                                    style={{ cursor: "pointer" }}
                                />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment
                                style={{ margin: 0 }}
                                position="end"
                            >
                                min
                            </InputAdornment>
                        }
                        name="car"
                        onChange={e => handleChange(e)}
                    />
                </CheckboxWrapper>
                <CheckboxWrapper>
                    <Input
                        id="outlined"
                        style={{ width: 100 }}
                        value={state.train}
                        startAdornment={
                            <InputAdornment
                                style={{ margin: 0 }}
                                position="start"
                            >
                                <TrainIcon style={{ cursor: "pointer" }} />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment
                                style={{ margin: 0 }}
                                position="end"
                            >
                                min
                            </InputAdornment>
                        }
                        name="train"
                        onChange={e => handleChange(e)}
                    />
                </CheckboxWrapper>
                <CheckboxWrapper>
                    <Input
                        id="outlined"
                        style={{ width: 100 }}
                        value={state.bike}
                        startAdornment={
                            <InputAdornment
                                style={{ margin: 0 }}
                                position="start"
                            >
                                <DirectionsBikeIcon
                                    style={{ cursor: "pointer" }}
                                />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment
                                style={{ margin: 0 }}
                                position="end"
                            >
                                min
                            </InputAdornment>
                        }
                        name="bike"
                        onChange={e => handleChange(e)}
                    />
                </CheckboxWrapper>
                <CheckboxWrapper>
                    <Input
                        id="outlined"
                        style={{ width: 100 }}
                        value={state.foot}
                        startAdornment={
                            <InputAdornment
                                style={{ margin: 0 }}
                                position="start"
                            >
                                <DirectionsWalkIcon
                                    style={{ cursor: "pointer" }}
                                />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment
                                style={{ margin: 0 }}
                                position="end"
                            >
                                min
                            </InputAdornment>
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
                        <img
                            src="/img/sun.png"
                            style={{ width: 33 }}
                            className="weatherIcon"
                        />
                    </CheckboxWrapper>
                    <CheckboxWrapper>
                        <Checkbox
                            checked={state.rain}
                            color="default"
                            onClick={() => changeWeather("rain")}
                        />

                        <img
                            src="/img/rain.png"
                            style={{ width: 27 }}
                            className="weatherIcon"
                        />
                    </CheckboxWrapper>
                    <CheckboxWrapper>
                        <Checkbox
                            checked={state.hot}
                            color="default"
                            onClick={() => changeWeather("hot")}
                            // onChange={handleChange("gilad")}
                        />

                        <img
                            src="/img/hot.png"
                            style={{ width: 27 }}
                            className="weatherIcon"
                        />
                    </CheckboxWrapper>
                    <CheckboxWrapper>
                        <Checkbox
                            checked={state.cold}
                            color="default"
                            onClick={() => changeWeather("cold")}
                        />

                        <img
                            src="/img/cold.png"
                            style={{ width: 27 }}
                            className="weatherIcon"
                        />
                    </CheckboxWrapper>
                </ContainerWeather>
                {error && (
                    <div className="error">
                        <p>Something went wrong. Please try again!</p>
                    </div>
                )}
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
