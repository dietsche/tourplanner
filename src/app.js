import React, { useState, useEffect } from "react";
import axios from "./axios"; //not directly from axis, but our own version
import { BrowserRouter, Route } from "react-router-dom"; //Do I need it here???
import styled from "styled-components";
import AddCard from "./addcard";
import Results from "./results";
import { Details } from "./details";
import TestMap from "./maps";
//delete later
import Registration from "./registration";
import Login from "./login";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

console.log("ENV ", process.env.API_KEY);
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
    const [userLat, setUserLat] = useState("");
    const [userLong, setUserLong] = useState("");

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/api/user/`);
            console.log(data);
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
    function sendDestinationsToApp(filteredDestinations, dest) {
        setFilteredDestinations(filteredDestinations);
        setSelectedDestination(dest);
        console.log("currentDestinations in App!: ", filteredDestinations);
        console.log("selectedDestination: ", dest);
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
                <Route exact path="/addcard" render={() => <AddCard />} />
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
                        />
                    )}
                />
                <Route
                    path="/details/:id"
                    component={({ match }) => (
                        <Details
                            filteredDestinations={filteredDestinations}
                            selectedDestination={selectedDestination}
                            match={match}
                        />
                    )}
                />
                <Route exact path="/map" render={() => <TestMap />} />
            </BrowserRouter>
        </React.Fragment>
    );
}
