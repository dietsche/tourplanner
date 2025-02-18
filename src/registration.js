import React from "react";
import axios from "./axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Form } from "./welcome";
import {
    TextField,
    Checkbox,
    FormControlLabel,
    FormLabel,
    FormGroup
} from "@material-ui/core";

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
        axios
            .post("/registration", {
                email: this.email,
                password: this.password,
                first: this.first,
                last: this.last,
                city: this.city,
                street: this.street,
                nr: this.nr,
                zip: this.zip
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    handleChange(inputElement) {
        this[inputElement.target.name] = inputElement.target.value;
    }
    render() {
        return (
            <React.Fragment>
                <Form>
                    {!this.state.secondPart && (
                        <React.Fragment>
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
                            <button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    console.log("click");
                                    this.setState({
                                        secondPart: true
                                    });
                                }}
                            >
                                Register
                            </button>
                            <div className="switch">
                                {" "}
                                Already a member? Please{" "}
                                <Link to="/login">log in</Link>!
                            </div>
                        </React.Fragment>
                    )}
                    {this.state.secondPart && (
                        <React.Fragment>
                            <div className="row">
                                <div
                                    style={{
                                        width: 200,
                                        fontSize: 16,
                                        color: "darkgrey"
                                    }}
                                >
                                    To complete registration, please add your
                                    address.
                                </div>
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

                            <button
                                variant="outlined"
                                color="primary"
                                onClick={() => this.submit()}
                            >
                                Submit
                            </button>
                        </React.Fragment>
                    )}
                </Form>
            </React.Fragment>
        );
    }
}
