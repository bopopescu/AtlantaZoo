import React, { Component } from "react";
import "../css/Login.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {Redirect} from "react-router-dom";
import UserContext from "../UserContext";
import LoginService from '../_services/LoginService.js';

class Registration extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            confirm: "",
            userType: "",
            redirect: false
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handleSubmit = event => {
        const { setUserContext } = this.context;

        const { username, email, userType, password } = this.state;
        LoginService.register(username, email, password, userType)
                    .then(response => {
                        setUserContext({ username, email, userType, checkedLogin: true, loggedIn: true });
                        this.setState({ redirect: true });
                    })
                    .catch(response => {
                        response.json().then(resp => alert(resp.message));
                    });
        event.preventDefault();
    };

    validateEmail(email) {
        let re = /^\w+@\w+\.\w+$/;
        return re.test(String(email).toLowerCase());
    }

    validateForm() {
        const {username, password, email, confirm, userType} = this.state;
        if (username.length > 0
            && password.length >= 8
            && email.length > 0
            && confirm.length > 0
            && userType.length > 0) {
            if (!this.validateEmail(email)) {
                return false
            } else if (password !== confirm) {
                return false;
            }
            return true;
        }
        return false;
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            switch(this.state.userType.toLowerCase()){
                case 'visitor':
                    return <Redirect to="/visitorhome"/>;
                case 'staff':
                    return <Redirect to="/staffhome"/>;
            }
        }
    };

    render() {
        return (
            <div className="Registration">
                <Grid container justify="center">
                    <header id="title">Registration</header>
                </Grid>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <TextField
                            id="email"
                            label="Email"
                            placeholder="email"
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            margin="normal" />
                        <TextField
                            id="username"
                            label="Username"
                            placeholder="username"
                            value={this.state.username}
                            onChange={this.handleChange('username')}
                            margin="normal" />
                        <TextField
                            id="password"
                            label="Password"
                            placeholder="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            margin="normal" />
                        <TextField
                            id="confirm"
                            label="Confirm Password"
                            placeholder="confirm password"
                            type="password"
                            value={this.state.confirm}
                            onChange={this.handleChange('confirm')}
                            margin="normal" />
                        <FormControl>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={this.state.userType}
                                onChange={this.handleChange('userType')}
                            >
                                <MenuItem value={'VISITOR'}>VISITOR</MenuItem>
                                <MenuItem value={'STAFF'}>STAFF</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        {this.renderRedirect()}
                        <Button
                            id="register"
                            type="submit"
                            disabled={!this.validateForm()}
                        >
                            Register
                        </Button>
                    </Grid>
                </form>
            </div >
        )
    }
}
export default Registration;