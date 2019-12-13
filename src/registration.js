import React from "react";
import axios from "./axios"; //not directly from axis, but our own version
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Form } from "./welcome";
import {
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    FormLabel,
    FormGroup
} from "@material-ui/core";
// import { spacing, typography } from "@material-ui/system";

const TextFieldWrapper = styled.div`
    padding: 10px;
    width: 200px;
`;
export const MyTextField = styled(TextField)({
    margin: "30px 30px 30px 30px",

    color: "white",
    height: 48,
    padding: "0 30px"
});

export const MyFormGroup = styled.div`
    display: flex;
    max-width: 80%,
    min-widht: 300px;
    align-items: center;
    margin: 10px auto;

`;

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    submit() {
        console.log("registration.js: Submit-func running");
        console.log(this.first);
        console.log(this.last);
        axios
            .post("/registration", {
                email: this.email, //State ist eigentliche for detecting changes on screen and reacting
                password: this.password,
                first: this.first,
                last: this.last,
                city: this.city,
                street: this.street,
                nr: this.nr,
                zip: this.zip
            })
            .then(({ data }) => {
                console.log("registration.js: axios-post .then");
                if (data.success) {
                    console.log("...");
                    location.replace("/"); //replace> page in history is replaced in history > you cant go back in browser!!!!
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    handleChange(inputElement) {
        console.log(inputElement.target.name);
        console.log(inputElement.target.value);
        this[inputElement.target.name] = inputElement.target.value;
    }
    render() {
        return (
            <React.Fragment>
                <Form>
                    <div className="row">
                        <input
                            required
                            name="first"
                            type="text"
                            placeholder="First Name"
                            onChange={e => this.handleChange(e)}
                        />
                        <input
                            required
                            name="last"
                            type="text"
                            placeholder="Last Name"
                            onChange={e => this.handleChange(e)}
                        />
                    </div>
                    <div className="row">
                        <input
                            required
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={e => this.handleChange(e)}
                        />
                        <input
                            required
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={e => this.handleChange(e)}
                        />
                    </div>
                    <div className="row">
                        <input
                            className="street"
                            required
                            name="street"
                            type="text"
                            placeholder="Street"
                            onChange={e => this.handleChange(e)}
                        />
                        <input
                            className="nr"
                            required
                            type="text"
                            name="nr"
                            placeholder="No"
                            onChange={e => this.handleChange(e)}
                        />
                    </div>
                    <div className="row">
                        <input
                            className="zip"
                            required
                            type="text"
                            name="zip"
                            placeholder="Zip Code"
                            onChange={e => this.handleChange(e)}
                        />
                        <input
                            className="city"
                            required
                            name="city"
                            type="text"
                            placeholder="City"
                            onChange={e => this.handleChange(e)}
                        />
                    </div>

                    {this.state.error && (
                        <div className="error">
                            Something went wrong. Please try again!
                        </div>
                    )}

                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => this.submit()}
                    >
                        Register
                    </Button>
                    <div className="switch">
                        {" "}
                        Already a member? Please <Link to="/login">log in</Link>
                        !
                    </div>
                </Form>
            </React.Fragment>
        );
    }
}
