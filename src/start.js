import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";

import Welcome from "./welcome";
import App from "./app";

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Open Sans', sans-serif;
        background-color: rgb(242, 242, 242);
        width: 100vw;
    }
    button, a {
        cursor: pointer;
    }
`;

let elem = (
    <React.Fragment>
        <Welcome />
        <GlobalStyle />
    </React.Fragment>
);

if (location.pathname != "/welcome") {
    elem = (
        <React.Fragment>
            <App />
            <GlobalStyle />
        </React.Fragment>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
