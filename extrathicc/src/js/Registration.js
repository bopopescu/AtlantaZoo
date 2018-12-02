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
        if (!this.validateEmail()) {
            alert("Email should be in format abc@abc.abc");
            event.preventDefault();
            return ""
        }
        if (!this.validatePassword()) {
            if (this.state.password.length < 8) {
                alert("Password should be at least 8 characters long");
            } else {
                alert("Confirm password should match with input password");
            }
            event.preventDefault();
            return ""
        }
        if (!this.validateUserType()) {
            alert("Missing User Type");
            event.preventDefault();
            return ""
        }
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

    validateEmail() {
        const{email} = this.state;
        let re = /^\w+@\w+\.\w+$/;
        return re.test(String(email).toLowerCase());
    }

    validatePassword() {
        const {password,  confirm} = this.state;
        return password.length>=8 && password.localeCompare(confirm) === 0;
    }

    validateUserType() {
        const{userType} = this.state;
        return userType.length > 0;
    }

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
                            required
                            id="email"
                            label="Email"
                            placeholder="email"
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            margin="normal" />
                        <TextField
                            required
                            id="username"
                            label="Username"
                            placeholder="username"
                            value={this.state.username}
                            onChange={this.handleChange('username')}
                            margin="normal" />
                        <TextField
                            required
                            id="password"
                            label="Password"
                            placeholder="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            margin="normal" />
                        <TextField
                            required
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