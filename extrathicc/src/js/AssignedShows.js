import React, { Component } from "react";
import "../css/Login.css";
import { Grid } from "@material-ui/core";
import ShowTable from "./ShowTable";

class AssignedShows extends Component {
    render() {
        return (
            <div className={'Animal'}>
                <Grid container justify="center">
                    <header id="title">Assigned Shows</header>
                </Grid>

                <ShowTable> </ShowTable>
            </div>
        );
    }
}

export default AssignedShows;