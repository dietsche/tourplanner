import React, { useState, useEffect } from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Form } from "./start";
import ResultCard from "./resultcard";
import Slider from "@material-ui/core/Slider";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TrainIcon from "@material-ui/icons/Train";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ScheduleIcon from "@material-ui/icons/Schedule";
var moment = require("moment");

// import { spacing, typography } from "@material-ui/system";

const FilterBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    width: 100vw;
    padding-bottom: 10px;
`;

const Shadow = styled.div`
    height: 1px;
    width: 100vw;
    box-shadow: 0 1.5px 3px;
`;

const WeatherContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin: 5px 20px;
    div {
        width: 74vw;
        max-width: 400px;
        p {
            font-size: calc(14px + .1vw);
            color: rgb(50, 50, 50);
            text-align: center;
        }

    }
    .arrow-container {
        width: 13vw;
        p {
            font-family: "Fredoka One", cursive;
            cursor: pointer;
            margin: auto 5vw;
        }

`;

const DistanceContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 5px 20px;
    .distance-icon {
        margin: 0 15px 15px 0;
    }
`;

const NrResults = styled.div`
    display: flex;
    justify-content: flex-end;
    align-content: center;
    height: 20px;
    width: 100%;
    p {
        font-size: 12px;
        font-weight: bold;
        color: black;
        margin-right: 30px;
    }
`;

const ResultsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-content: start;
    margin-top: 10px;
    flex-wrap: wrap;
    height: calc(100vh - 320px);
    width: 100%;
    .no-results {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
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
        background-color: rgb(41, 84, 110);

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
const SpinnerContainer = styled.div`
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
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
        color: "rgb(41, 84, 110)",
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

export default function Result({
    sendDestinationsToApp,
    previousDay,
    alreadyFiltered,
    previousDistance,
    previousTrain,
    previousCar,
    previousBike,
    previousFoot
}) {
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [weatherData, setWeatherData] = useState({ data: [] });
    const [distance, setDistance] = useState(30);
    const [train, setTrain] = useState(true);
    const [car, setCar] = useState(true);
    const [bike, setBike] = useState(true);
    const [foot, setFoot] = useState(true);
    const [norain, setNorain] = useState(false);
    const [rain, setRain] = useState(false);
    const [hot, setHot] = useState(false);
    const [cold, setCold] = useState(false);
    const [day, setDay] = useState(0);

    useEffect(() => {
        console.log("componentDidMount!");

        (async () => {
            const { data } = await axios.get("/getweather");
            console.log("data.weatherData: ", data.weatherData);

            const weatherObject = {};
            for (let i = 0; i < 5; i++) {
                weatherObject[i] = {
                    temperatureHigh: Math.round(
                        data.weatherData.daily.data[i].temperatureHigh
                    ),
                    precipIntensity:
                        data.weatherData.daily.data[i].precipIntensity,
                    summary: data.weatherData.daily.data[i].summary
                };
            }
            console.log("WEATHEROBJECT: ", weatherObject);
            setWeatherData({
                data: weatherObject
            });
        })();
    }, []);

    useEffect(() => {
        console.log("componentDidMount!");
        console.log(
            "FilteredDestinations when comp mountS: ",
            filteredDestinations
        );
        console.log("alreadyFiltered: ", alreadyFiltered);

        (async () => {
            const { data } = await axios.get("/api/destinations");
            console.log("data destinations: ", data);
            console.log("dest ROWS: ", data.destinationData);
            data.destinationData.sort(a => (a.favourite ? -1 : 1));
            setDestinations(data.destinationData);
        })();
        if (alreadyFiltered) {
            setDistance(previousDistance);
            setDay(previousDay);
            setCar(previousCar);
            setTrain(previousTrain);
            setBike(previousBike);
            setFoot(previousFoot);
        }
    }, [alreadyFiltered]);

    function changeDay(plusMinus) {
        let nextDay = day + 1;
        let previousDay = day - 1;
        if (plusMinus == "plus") {
            setDay(nextDay);
        } else {
            setDay(previousDay);
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
        console.log("WEATHER DATA ", weatherData);
        console.log("WEATHER DATA.data ", weatherData.data);
        console.log("WEATHER DATA.length ", weatherData.data[4]);
        if (weatherData.data[4]) {
            console.log(
                "weatherData.data[0].precipIntensity: ",
                weatherData.data[day].precipIntensity,
                day
            );
            if (weatherData.data[day].precipIntensity > 0.03) {
                setRain(true);
                console.log("regentag!");
            } else {
                setRain(false);
            }
            if (weatherData.data[day].temperatureHigh < 10) {
                console.log(
                    "kaltkaltkaltkaltkaltkaltkaltkaltkaltkaltkaltkaltkaltkaltkaltkalt"
                );
                setCold(true);
            } else {
                setCold(false);
            }
            if (weatherData.data[day].temperatureHigh > 20) {
                console.log("kalt");
                setHot(true);
            } else {
                setHot(false);
            }
        }
    }, [weatherData.data, day, hot, cold, rain, norain]);

    useEffect(() => {
        console.log("USE EFFECT RUNS");
        console.log("log destinations in use Effect: ", destinations);

        destinations.map(dest => {
            console.log(
                "weather check for destinations: ",
                (!rain || (rain && dest.rain)) &&
                    (!cold || (cold && dest.cold)) &&
                    (!hot || (hot && dest.hot))
            );
        });

        setFilteredDestinations(
            destinations.filter(
                dest =>
                    ((car && dest.car && dest.car <= distance) ||
                        (bike && dest.bike && dest.bike <= distance) ||
                        (train && dest.train && dest.train <= distance) ||
                        (foot && dest.foot && dest.foot <= distance)) &&
                    (!rain || (rain && dest.rain)) &&
                    (!cold || (cold && dest.cold)) &&
                    (!hot || (hot && dest.hot))
            )
            // .sort((a, b) =>
            //     Math.min[(a.car, a.train, a.bike, a.foot)] >
            //     Math.min[(b.car, b.train, b.bike, b.foot)]
            //         ? 1
            //         : -1
            // )
        );
    }, [
        destinations,
        cold,
        hot,
        rain,
        norain,
        distance,
        car,
        train,
        bike,
        foot
    ]);

    function sendDataToApp(dest) {
        console.log("SENDING");
        sendDestinationsToApp(
            filteredDestinations,
            distance,
            day,
            train,
            car,
            bike,
            foot,
            dest
        ); //nicht aktueller Stand der hier verschickt wird: (1) immer ein durchlauf hinterher + (2)WEtterdaten fehlen noch!!!
    }
    console.log("cold === dest.cold: ", cold, destinations);
    if (!weatherData.data[4]) {
        return (
            <SpinnerContainer>
                {" "}
                <CircularProgress
                    color="secondary"
                    style={{
                        height: "20vw",
                        maxHeight: "100px",
                        width: "20vw",
                        maxWidth: "100px"
                    }}
                />
            </SpinnerContainer>
        );
    }

    return (
        <React.Fragment>
            <ExpansionPanel
                style={{
                    backgroundColor: "white",
                    padding: 0,
                    margin: "0 auto"
                }}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{
                        height: 18,
                        flexGrow: 0,
                        marginLeft: "calc(100vw - 140px)"
                    }}
                >
                    <p style={{ fontSize: 15 }}>Filter</p>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: 0 }}>
                    <FilterBar>
                        <WeatherContainer>
                            <div className="arrow-container">
                                {day > 0 && (
                                    <p
                                        onClick={() => {
                                            changeDay("minus");
                                        }}
                                    >
                                        {" "}
                                        &lt;
                                    </p>
                                )}
                            </div>
                            <div>
                                <p>
                                    <span>
                                        {day > 0
                                            ? day > 1
                                                ? moment()
                                                      .add(day, "days")
                                                      .format("dddd")
                                                : "Tomorrow"
                                            : "Today"}{" "}
                                    </span>{" "}
                                    max.{" "}
                                    {weatherData.data &&
                                        weatherData.data[day] &&
                                        weatherData.data[day]
                                            .temperatureHigh}{" "}
                                    °C |{" "}
                                    {weatherData.data &&
                                        weatherData.data[day] &&
                                        weatherData.data[day].summary}
                                </p>
                            </div>
                            <div className="arrow-container">
                                {day < 4 && (
                                    <p
                                        onClick={() => {
                                            changeDay("plus");
                                        }}
                                    >
                                        {" "}
                                        &gt;
                                    </p>
                                )}
                            </div>
                        </WeatherContainer>
                        <DistanceContainer>
                            <div className="distance-icon">
                                <ScheduleIcon />
                            </div>
                            <div>
                                <DistanceSlider
                                    onChange={(e, val) => {
                                        console.log("val ", val);
                                        setDistance(val);
                                    }}
                                    valueLabelDisplay="off"
                                    aria-label="pretto slider"
                                    defaultValue={previousDistance || 30}
                                    marks={marks}
                                    max={60}
                                    step={5}
                                />
                            </div>
                        </DistanceContainer>
                        <TransportContainer>
                            <div onClick={() => changeMode("car")}>
                                <DirectionsCarIcon
                                    style={{ color: "white" }}
                                    onClick={() => changeMode("car")}
                                />
                                {!car && <div> </div>}
                            </div>
                            <div onClick={() => changeMode("train")}>
                                <TrainIcon
                                    style={{ color: "white" }}
                                    onClick={() => changeMode("train")}
                                />{" "}
                                {!train && <div> </div>}
                            </div>
                            <div onClick={() => changeMode("bike")}>
                                <DirectionsBikeIcon
                                    style={{ color: "white" }}
                                    onClick={() => changeMode("bike")}
                                />
                                {!bike && <div> </div>}
                            </div>
                            <div onClick={() => changeMode("foot")}>
                                <DirectionsWalkIcon
                                    style={{ color: "white" }}
                                    onClick={() => changeMode("foot")}
                                />
                                {!foot && <div> </div>}
                            </div>
                        </TransportContainer>
                    </FilterBar>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <Shadow> </Shadow>

            <NrResults>
                {" "}
                <p>{filteredDestinations.length} results</p>{" "}
            </NrResults>
            <ResultsContainer>
                {destinations.length == 0 && (
                    <div className="no-results">
                        <p>Welcome to PiTou!</p>{" "}
                        <p>
                            <a href="/addcard">Add Destinations</a> to your
                        </p>
                        collection!
                    </div>
                )}
                {filteredDestinations &&
                    filteredDestinations.map(dest => (
                        <Link
                            to={{ pathname: "/details/" + dest.id }}
                            key={dest.id}
                            style={{ textDecoration: "none", color: "black" }}
                            onClick={() => {
                                sendDataToApp(dest);
                            }}
                        >
                            <ResultCard
                                distance={distance}
                                key={dest.id}
                                title={dest.title}
                                description={dest.description}
                                car={car && dest.car}
                                train={train && dest.train}
                                bike={bike && dest.bike}
                                foot={foot && dest.foot}
                                norain={dest.norain}
                                rain={dest.rain}
                                hot={dest.hot}
                                cold={dest.cold}
                                favourite={dest.favourite}
                            />
                        </Link>
                    ))}
            </ResultsContainer>
        </React.Fragment>
    );
}
