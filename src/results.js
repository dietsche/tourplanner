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
    const [norain, setNorain] = useState(false);
    const [rain, setRain] = useState(false);
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
            setRain(true);
            console.log("regentag!");
        } else {
            setNorain(true);
        }
        if (weatherData.temperatureHighToday < 10) {
            console.log("kalt");
            setCold(true);
        }
        if (weatherData.temperatureHighToday > 20) {
            console.log("kalt");
            setHot(true);
        }
    }, [destinations, weatherData, rain, norain]);

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
        sendDestinationsToApp(filteredDestinations, dest); //nicht aktueller Stand der hier verschickt wird: (1) immer ein durchlauf hinterher + (2)WEtterdaten fehlen noch!!!
    }
    console.log("cold === dest.cold: ", cold, destinations);
    if (weatherData.length == 0) {
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
                                {tomorrow && <p onClick={changeDay}> &lt;</p>}
                            </div>
                            <div>
                                <p>
                                    {today ? (
                                        <span>Today</span>
                                    ) : (
                                        <span>Tomorrow</span>
                                    )}{" "}
                                    max. {weatherData.temperatureHigh} °C |{" "}
                                    {weatherData.summary}
                                </p>
                            </div>
                            <div className="arrow-container">
                                {today && <p onClick={changeDay}> &gt;</p>}
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
                                    defaultValue={30}
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
                            />
                        </Link>
                    ))}
            </ResultsContainer>
        </React.Fragment>
    );
}
