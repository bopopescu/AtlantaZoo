import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import "../../css/Login.css";
import LoginService from "../../_services/LoginService.js";
import UserContext from "../../UserContext";

class StaffHome extends Component {
    static contextType = UserContext;

    logout = event => {
        const {setUserContext} = this.context;
        LoginService.logout()
            .then(resp => setUserContext({loggedIn: false}))
            .catch(resp => resp.json().then(r => alert(r.message)));
    };

    render() {
        return (
            <div className="HomePage" >
                <Grid container direction="row" justify="center">
                    <header id="title">Home Page</header>
                </Grid>
                <Grid container direction="column" justify="space-evenly" alignItems="center">
                    <Link to="/assigned_shows">View Shows</Link>
                    <Link to="/animals">Search for Animals</Link>
                    <Link to="/" onClick={this.logout}>Log out</Link>
                </Grid>
            </div >
        );
    };
}

export default StaffHome;