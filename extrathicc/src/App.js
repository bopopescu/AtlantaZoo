import React from "react";
import "./App.css";
import MenuIcon from "@material-ui/icons/Menu";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  withStyles
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Routes from "./Routes";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

const App = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Menu
          </Typography>
          <Grid container direction="row" justify="flex-end" alignItems="center">
            <Link to="/registration">Registration</Link>
            <Link to="/login">Login</Link>
          </Grid>
        </Toolbar>
      </AppBar>
      <Routes />
    </div>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);