import React, { Component } from "react";
import "../css/Login.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            confirm: "",
            user_type: "",
            redirect: false
        };
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handleSubmit = event => {
        fetch('http://localhost:5000/users',
            {
                method: 'POST',
                body: JSON.stringify({ username: this.state.username, email: this.state.email, password: this.state.password, user_type: this.state.user_type }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    this.setState({ redirect: true });
                } else {
                    response.json().then(resp => alert(resp.message));
                }
            })
            .catch(error => console.error('Error:', error));
        event.preventDefault();
    }

    validateForm() {
        if (this.state.username.length > 0 && this.state.password.length > 0 && this.state.email.length > 0 && this.state.confirm.length > 0) {
            if (!this.state.email.includes('@')) {
                return false;
            } else if (this.state.password !== this.state.confirm) {
                return false;
            }
            return true;
        }
        return false;
    }

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
                            <InputLabel htmlFor="age-simple">Type</InputLabel>
                            <Select
                                value={this.state.user_type}
                                onChange={this.handleChange('user_type')}
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
                        <Button
                            id="register"
                            disabled={!this.validateForm()}
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