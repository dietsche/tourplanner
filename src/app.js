import React, { useState, useEffect } from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import styled from "styled-components";
import AddCard from "./addcard";
import Results from "./results";
import { Details } from "./details";
import TestMap from "./maps";
import Registration from "./registration";
import Login from "./login";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    height: 25px;
    background-color: rgb(41, 84, 110);
    padding: 15px;
    > span {
        display: flex;
        align-items: center;
        img {
            height: 40px;
        }
        > p {
            color: red;
            font-family: "Gochi Hand", cursive;
        }
    }
    > .logged-in-user {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 34px;
        width: 34px;
        border-radius: 50%;
        background-color: white;
        font-size: 12px;
        cursor: pointer;
        margin-top: -5px;
        letter-spacing: 1px;
    }
`;

const MenuContent = styled.div`
    div {
        margin: 15px 10px;
        font-size: 14px;
    }
    a {
        text-decoration: none;
    }
`;

export default function App() {
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [initials, setInitials] = useState("");
    const [filteredDestinations, setFilteredDestinations] = useState("");
    const [selectedDestination, setSelectedDestination] = useState("");
    const [userLat, setUserLat] = useState(null);
    const [userLong, setUserLong] = useState(null);
    const [alreadyFiltered, setAlreadyFiltered] = useState(false);
    const [previousDistance, setPreviousDistance] = useState(null);
    const [previousDay, setPreviousDay] = useState(null);
    const [previousTrain, setPreviousTrain] = useState(true);
    const [previousCar, setPreviousCar] = useState(true);
    const [previousBike, setPreviousBike] = useState(true);
    const [previousFoot, setPreviousFoot] = useState(true);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/api/user/`);
            setFirst(data.first);
            setLast(data.last);
            setInitials(data.first.charAt(0) + data.last.charAt(0));
            setUserLat(data.lat);
            setUserLong(data.long);
        })();
    }, []);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    function sendDestinationsToApp(
        filteredDestinations,
        distance,
        day,
        train,
        car,
        bike,
        foot,
        dest
    ) {
        setFilteredDestinations(filteredDestinations);
        setPreviousDay(day);
        setPreviousDistance(distance);
        setPreviousTrain(train);
        setPreviousCar(car);
        setPreviousBike(bike);
        setPreviousFoot(foot);
        setSelectedDestination(dest);
        setAlreadyFiltered(true);
    }

    async function changeStarState(id, starState) {
        let changedFavourites = await axios.post(`/update-favourites`, {
            id: id,
            favourite: starState
        });
    }

    return (
        <React.Fragment>
            <BrowserRouter>
                <Header>
                    <span>
                        <img src="/img/logo_marker.png" />
                    </span>
                    <div
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        className="logged-in-user"
                    >
                        {initials}
                    </div>{" "}
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuContent>
                            <div style={{ fontSize: 14 }}>Welcome {first}!</div>

                            <a href="/addcard">
                                {" "}
                                <div onClick={handleClose}>
                                    Add Destination
                                </div>{" "}
                            </a>

                            <a href="/logout">
                                <div onClick={handleClose}>Logout</div>
                            </a>
                        </MenuContent>
                    </Menu>
                </Header>
                <Route
                    exact
                    path="/addcard"
                    render={() => (
                        <AddCard userLat={userLat} userLong={userLong} />
                    )}
                />
                <Route
                    exact
                    path="/registration"
                    render={() => <Registration />}
                />
                <Route exact path="/login" render={() => <Login />} />
                <Route
                    exact
                    path="/"
                    render={() => (
                        <Results
                            sendDestinationsToApp={sendDestinationsToApp}
                            previousDistance={previousDistance}
                            previousTrain={previousTrain}
                            previousCar={previousCar}
                            previousBike={previousBike}
                            previousFoot={previousFoot}
                            previousDay={previousDay}
                            alreadyFiltered={alreadyFiltered}
                        />
                    )}
                />
                <Route
                    path="/details/:id"
                    component={({ match }) => (
                        <Details
                            filteredDestinations={filteredDestinations}
                            selectedDestination={selectedDestination}
                            changeStarState={changeStarState}
                            match={match}
                        />
                    )}
                />
                <Route exact path="/map" render={() => <TestMap />} />
            </BrowserRouter>
        </React.Fragment>
    );
}
