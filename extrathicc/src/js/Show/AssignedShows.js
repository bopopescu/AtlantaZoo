import React, { Component } from "react";
import "../../css/Login.css";
import { Grid } from "@material-ui/core";
import AssignedTable from "./AssignedTable";

class AssignedShows extends Component {
    render() {
        return (
            <div className={'Animal'}>
                <Grid container justify="center">
                    <header id="title">Assigned Shows</header>
                </Grid>

                <AssignedTable> </AssignedTable>
            </div>
        );
    }
}

export default AssignedShows;