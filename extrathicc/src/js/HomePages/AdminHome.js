import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Grid} from "@material-ui/core";
import "../../css/Login.css";
import LoginService from "../../_services/LoginService";
import UserContext from "../../UserContext";

class AdminHome extends Component {
    static contextType = UserContext;

    logout = event => {
        const {setUserContext} = this.context;
        LoginService.logout()
            .then(resp => setUserContext({loggedIn: false}))
            .catch(resp => resp.json().then(r => alert(r.message)));
    };
    render() {
        return (
            <div className="HomePage">
                <Grid container direction="row" justify="space-evenly">
                    <header id="title">Home Page</header>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid container direction="column" justify="space-evenly" alignItems="center">
                        <Link to="/visitors">View Visitors</Link>
                        <Link to="/shows">View Shows</Link>
                        <Link to="/addshow">Add Show</Link>
                        <Link to="/addanimal">Add Animal</Link>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid container direction="column" justify="space-evenly" alignItems="center">
                        <Link to="/staff">View Staff</Link>
                        <Link to="/animals">View Animals</Link>
                        <Link to="/" onClick={this.logout}>Log out</Link>
                    </Grid>
                </Grid>
            </div>
        );
    };
}

export default AdminHome;