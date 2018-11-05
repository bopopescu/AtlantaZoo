import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import "../css/Login.css";

class HomePage extends Component {
  render() {
    return (
      <div className="HomePage" >
        <Grid container direction="row" justify="center">
          <header id="title">Home Page</header>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid container direction="column" justify="space-evenly" alignItems="center">
            <Link to="/exhibits/">Search Exhibits</Link>
            <Link to="/shows/">Search Shows</Link>
            <Link to="/animals/">Search for Animals</Link>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid container direction="column" justify="space-evenly" alignItems="center">
            <Link to="/exhibits/history">View exhibit history</Link>
            <Link to="/shows/history">Search Shows</Link>
            <Link to="/">Log out</Link>
          </Grid>
        </Grid>
      </div >
    );
  };
}

export default HomePage;