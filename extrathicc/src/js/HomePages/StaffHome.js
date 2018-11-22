import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import "../../css/Login.css";

class StaffHome extends Component {
    render() {
        return (
            <div className="HomePage" >
                <Grid container direction="row" justify="center">
                    <header id="title">Home Page</header>
                </Grid>
                <Grid container direction="column" justify="space-evenly" alignItems="center">
                    <Link to="/assigned/shows">View Shows</Link>
                    <Link to="/animals">Search for Animals</Link>
                    <Link to="/">Log out</Link>
                </Grid>
            </div >
        );
    };
}

export default StaffHome;