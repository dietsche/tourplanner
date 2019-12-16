import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import styled from "styled-components";

export const Form = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
        margin: 7px 7px;
        padding: 5px;
        border-radius: 3px;
        width: 160px;
        height: 22px;
        font-size: 17px;
    }
    .street {
        width: 130px;
    }

    .nr {
        width: 30px;
    }
    .zip {
        width: 55px;
    }
    .city {
        width: 110px;
    }
    button {
        margin: 10px auto;
        width: 100px;
        height: 35px;
        border-radius: 3px;
        border: 2px rgb(80, 80, 80) solid;
        background: red;
        color: white;
        font-size: 18px;
        background-color: rgb(238, 56, 64);
    }
    div {
        color: white;
        a {
            color: white;
        }
    }
    .switch {
    }
    .error {
        color: red;
    }
    .row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
`;

const LogoContainer = styled.div`
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(41, 84, 110);
    img {
        width: 120px;
        margin-bottom: 2vh;
        margin-top: 20px;
    }
    div {
        width: 80vw;
        text-align: center;
        margin: 1vh;
        p {
            color: white;
            font-size: 20px;
            font-family: "Gochi Hand", cursive;
        }
        p.pitou {
            font-size: 70px;
            color: rgb(238, 56, 64);
            margin: -15px auto;
        }
    }
`;

export default function Welcome() {
    return (
        <React.Fragment>
            <LogoContainer>
                <img src="/img/logo.png" />
                <div>
                    <p className="pitou">piTou</p>
                </div>
                <div>
                    <p> Pick your Tour! [noch ein Satz der App erläutert...]</p>
                </div>

                <HashRouter>
                    <div>
                        <Route exact path="/" component={Login} />
                        <Route path="/registration" component={Registration} />
                    </div>
                </HashRouter>
            </LogoContainer>
        </React.Fragment>
    );
}
