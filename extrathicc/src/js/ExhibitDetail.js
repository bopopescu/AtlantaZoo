import React, { Component } from "react";
import "../css/Login.css";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid } from "@material-ui/core";

class ExhibitDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            size: 0,
            num_animals: 0,
            water_feature: true,
            animals: [], // query
            redirect: false
        };
    }
    render() {
        return (
            <div className={'ExhibitDetail'}>
                <Grid container justify="center">
                    <header id="title">Exhibit Detail</header>
                </Grid>
                <Paper >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Species</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.animals.map(animal => {
                                return (
                                    <TableRow key={animal.id}>
                                        <TableCell component="th" scope="row">
                                            {animal.name}
                                        </TableCell>
                                        <TableCell>{animal.species}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

export default ExhibitDetail;