import React, { useState, useEffect } from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Form } from "./start";
import ResultCard from "./resultcard";
import Slider from "@material-ui/core/Slider";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import TrainIcon from "@material-ui/icons/Train";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";

// import { spacing, typography } from "@material-ui/system";

const FilterBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    width: 100vw;
    background-color: rgb(113, 169, 90);
    /* padding: 0 10px; */
    box-shadow: 0 1px 3px;

    /* div {
        margin: 0 20px;
    } */
`;

const WeatherContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    div {
        width: 74vw;
    }
    .arrow-container {
        width: 13vw;
    }
    h2 {
        font-size: 14px;
        color: rgb(50, 50, 50);
        text-align: center;
    }

    p {
        font-family: "Fredoka One", cursive;
        cursor: pointer;
        margin: auto 5vw;
    }
`;

const DistanceContainer = styled.div`
    display: flex;
    align-items: center;
    div:nth-of-type(1) {
    }
    div:nth-of-type(2) {
        margin-top: 4px;
        margin-left: 10px;
    }
`;
const ResultsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-content: start;
    margin-top: 10px;
    flex-wrap: wrap;
    height: calc(100vh - 300px);
    width: 100%;
`;

const TransportContainer = styled.div`
    display: flex;
    margin-bottom: 10px;

    > div {
        margin: 0 10px;
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        height: 35px;
        width: 35px;
        background-color: white;
        border-radius: 50%;
        z-index: 50;
        cursor: pointer;

        > div {
            position: absolute;
            height: 100%;
            width: 100%;
            border-radius: 50%;
            background-color: rgba(250, 250, 250, 0.7);
            z-index: 100;
            cursor: pointer;
        }
    }
`;

const marks = [
    {
        value: 0,
        label: "0"
    },
    {
        value: 15,
        label: "15"
    },
    {
        value: 30,
        label: "30"
    },
    {
        value: 45,
        label: "45"
    },
    {
        value: 60,
        label: "60 +"
    }
];

const DistanceSlider = withStyles({
    root: {
        color: "white",
        height: 8,
        width: 200
    },
    markLabel: {
        fontSize: "12px",
        top: "33px"
    },

    thumb: {
        height: 16,
        width: 16,
        backgroundColor: "grey",
        border: "2px solid currentColor",
        marginTop: -3,
        marginLeft: -7,
        "&:focus,&:hover,&$active": {
            boxShadow: "inherit"
        }
    },
    mark: {
        backgroundColor: "black",
        height: 8,
        width: 3
    },
    active: {},
    valueLabel: {
        left: "calc(-50% + 4px)"
    },
    track: {
        height: 8,
        borderRadius: 1
    },
    rail: {
        height: 8,
        borderRadius: 1
    }
})(Slider);

export default function Result({ sendDestinationsToApp }) {
    const [destinations, setDestinations] = useState([]);
    const [weatherDestinations, setWeatherDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [distance, setDistance] = useState(30);
    const [train, setTrain] = useState(true);
    const [car, setCar] = useState(true);
    const [bike, setBike] = useState(true);
    const [foot, setFoot] = useState(true);
    const [today, setToday] = useState(true);
    const [tomorrow, setTomorrow] = useState(false);
    const [hot, setHot] = useState(false);
    const [cold, setCold] = useState(false);

    useEffect(() => {
        console.log("componentDidMount!");

        (async () => {
            const { data } = await axios.get("/getweather");
            console.log("data.weatherData: ", data.weatherData);
            const temperatureHighToday = Math.round(
                data.weatherData.daily.data[0].temperatureHigh
            );
            const summaryToday = data.weatherData.daily.data[0].summary;
            const temperatureHighTomorrow = Math.round(
                data.weatherData.daily.data[1].temperatureHigh
            );
            const summaryTomorrow = data.weatherData.daily.data[1].summary;
            const precipIntensityToday =
                data.weatherData.daily.data[0].precipIntensity;
            const precipIntensityTomorrow =
                data.weatherData.daily.data[1].precipIntensity;

            console.log(
                "RAIN DATA`????: ",
                data.weatherData.daily.data[0].precipIntensity,
                data.weatherData.daily.data[2].precipIntensity,
                data.weatherData.daily.data[3].precipIntensity,
                data.weatherData.daily.data[5].precipIntensity
            );

            setWeatherData({
                temperatureHigh: temperatureHighToday,
                precipIntensity: precipIntensityToday,
                summary: summaryToday,
                temperatureHighToday: temperatureHighToday,
                summaryToday: summaryToday,
                precipIntensityToday: precipIntensityToday,
                temperatureHighTomorrow: temperatureHighTomorrow,
                summaryTomorrow: summaryTomorrow,
                precipIntensityTomorrow: precipIntensityTomorrow
            });
        })();
    }, []);

    useEffect(() => {
        console.log("componentDidMount!");

        (async () => {
            const { data } = await axios.get("/api/destinations");
            console.log("data destinations: ", data);
            console.log("dest ROWS: ", data.destinationData);
            setDestinations(data.destinationData);
        })();
    }, []);

    function changeDay() {
        if (today) {
            setWeatherData({
                temperatureHigh: weatherData.temperatureHighTomorrow,
                summary: weatherData.summaryTomorrow,
                temperatureHighToday: weatherData.temperatureHighToday,
                summaryToday: weatherData.summaryToday,
                temperatureHighTomorrow: weatherData.temperatureHighTomorrow,
                summaryTomorrow: weatherData.summaryTomorrow
            });
            setToday(false);
            setTomorrow(true);
        } else if (tomorrow) {
            setWeatherData({
                temperatureHigh: weatherData.temperatureHighToday,
                summary: weatherData.summaryToday,
                temperatureHighToday: weatherData.temperatureHighToday,
                summaryToday: weatherData.summaryToday,
                temperatureHighTomorrow: weatherData.temperatureHighTomorrow,
                summaryTomorrow: weatherData.summaryTomorrow
            });
            setToday(true);
            setTomorrow(false);
            return;
        }
    }

    function changeMode(str) {
        if (str == "train") {
            train ? setTrain(false) : setTrain(true);
        } else if (str == "car") {
            car ? setCar(false) : setCar(true);
        } else if (str == "bike") {
            bike ? setBike(false) : setBike(true);
        } else if (str == "foot") {
            foot ? setFoot(false) : setFoot(true);
        }
    }

    useEffect(() => {
        console.log("state of car...: ", car, train);
        console.log(
            "weatherData.precipIntensityToday: ",
            weatherData.precipIntensityToday
        );
        if (weatherData.precipIntensityToday > 0.1) {
            console.log("regentag!");
        }
        if (weatherData.temperatureHighToday < 10) {
            console.log("kalt");
            setCold(true);
        }
        // setWeatherDestinations(
        //     destinations.filter(
        //         dest =>
        //             (car && dest.rain && dest.car <= distance) ||
        //             (bike && dest.bike && dest.bike <= distance) ||
        //             (train && dest.train && dest.train <= distance) ||
        //             (foot && dest.foot && dest.foot <= distance)
        //     )
        // );

        setFilteredDestinations(
            destinations.filter(
                dest =>
                    ((car && dest.car && dest.car <= distance) ||
                        (bike && dest.bike && dest.bike <= distance) ||
                        (train && dest.train && dest.train <= distance) ||
                        (foot && dest.foot && dest.foot <= distance)) &&
                    cold == dest.cold
            )
        );
    }, [
        distance,
        destinations,
        car,
        train,
        bike,
        foot,
        weatherData,
        cold,
        hot
    ]);
    function sendDataToApp() {
        console.log("SENDING");
        sendDestinationsToApp(filteredDestinations); //nicht aktueller Stand der hier verschickt wird: (1) immer ein durchlauf hinterher + (2)WEtterdaten fehlen noch!!!
    }
    console.log("cold === dest.cold: ", cold, destinations);
    return (
        <React.Fragment>
            <FilterBar>
                <WeatherContainer>
                    <div className="arrow-container">
                        {tomorrow && <p onClick={changeDay}> &lt;</p>}
                    </div>
                    <div>
                        <h2>
                            {today ? <span>Today</span> : <span>Tomorrow</span>}{" "}
                            max. {weatherData.temperatureHigh} °C |{" "}
                            {weatherData.summary}
                        </h2>
                    </div>
                    <div className="arrow-container">
                        {today && <p onClick={changeDay}> &gt;</p>}
                    </div>
                </WeatherContainer>
                <DistanceContainer>
                    <div>
                        <h2></h2>
                    </div>
                    <div>
                        <DistanceSlider
                            onChange={(e, val) => {
                                console.log("val ", val);
                                setDistance(val);
                            }}
                            valueLabelDisplay="off"
                            aria-label="pretto slider"
                            defaultValue={30}
                            marks={marks}
                            max={60}
                            step={5}
                        />
                    </div>
                </DistanceContainer>
                <TransportContainer>
                    <div onClick={() => changeMode("car")}>
                        <DirectionsCarIcon onClick={() => changeMode("car")} />
                        {!car && <div> </div>}
                    </div>
                    <div onClick={() => changeMode("train")}>
                        <TrainIcon onClick={() => changeMode("train")} />{" "}
                        {!train && <div> </div>}
                    </div>
                    <div onClick={() => changeMode("bike")}>
                        <DirectionsBikeIcon
                            onClick={() => changeMode("bike")}
                        />
                        {!bike && <div> </div>}
                    </div>
                    <div onClick={() => changeMode("foot")}>
                        <DirectionsWalkIcon
                            onClick={() => changeMode("foot")}
                        />
                        {!foot && <div> </div>}
                    </div>
                </TransportContainer>
            </FilterBar>
            <ResultsContainer>
                {filteredDestinations &&
                    filteredDestinations.map(dest => (
                        <Link
                            to={{ pathname: "/details/" + dest.id }}
                            key={dest.id}
                            style={{ textDecoration: "none", color: "black" }}
                            onClick={() => {
                                sendDataToApp(dest.id);
                            }}
                        >
                            <ResultCard
                                key={dest.id}
                                title={dest.title}
                                description={dest.description}
                                car={dest.car}
                                train={dest.train}
                                bike={dest.bike}
                                foot={dest.foot}
                                norain={dest.norain}
                                rain={dest.rain}
                                hot={dest.hot}
                                cold={dest.cold}
                            />
                        </Link>
                    ))}
            </ResultsContainer>
        </React.Fragment>
    );
}
