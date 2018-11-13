import React, { Component } from "react";
import "../css/Login.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import UserContext from "../UserContext.js";
import LoginService from "../_services/LoginService.js";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            redirect: false
        };
    }

    validateForm() {
        return this.state.email.length > 1 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    // modify later if user is not visitor
    handleSubmit = setUser => event => {
        const email = this.state.email;
        const password = this.state.password;
        LoginService.login(email, password)
                    .then(response => {
                        setUser({email, loggedIn: true});
                        this.setState({ redirect: true });
                    })
                    .catch(response => {
                        response.json().then(resp => alert(resp.message));
                    });
        event.preventDefault();
    };

    setRedirect = () => {
        this.setState({
            redirect: true
        });
    };

    renderRedirect = () => {
        if (this.state.redirect) {

            return <Redirect to="/home" />;
        }
    };

    render() {
        return (
            <div className="Login">
                <Grid container justify="center">
                    <header id="title">Login</header>
                </Grid>
                <UserContext.Consumer>
                    {({setUserContext}) => (
                        <form autoComplete="off" onSubmit={this.handleSubmit(setUserContext)}>
                            <Grid
                                container
                                direction="column"
                                justify="center"
                                alignitems="center"
                            >
                                <TextField
                                    id="email"
                                    label="email"
                                    placeholder="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    id="password"
                                    label="password"
                                    placeholder="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    margin="normal"
                                    variant="outlined"
                                    type="password"
                                />
                            </Grid>
                            <Grid container direction="row" justify="center" alignitems="center">
                                <Button
                                    variant="outlined"
                                    type="submit"
                                    disabled={!this.validateForm()}
                                >
                                    login
                                </Button>

                                {this.renderRedirect()}
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    type="submit"
                                    onClick={this.setRedirect}
                                >
                                    cancel
                                </Button>
                            </Grid>
                        </form>
                    )}
                </UserContext.Consumer>
            </div>
        );
    }
}

export default Login;
