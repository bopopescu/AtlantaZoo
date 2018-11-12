import React, { Component } from "react";
import "../css/Login.css";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid } from "@material-ui/core";

const titles = [
    'Name',
    'Species',
    'Age',
    'Exhibit',
    'Type'
]

class AnimalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            details: [],
        };

        // need to update this api for getting specific animal
        // based on name and species
        fetch('http://localhost:5000/animals', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(json => this.setState({ details: json.message }));
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/animals" />;
        }
    };
    setRedirect = () => {
        this.setState({
            redirect: true
        });
    };
    render() {
        return (
            <div className={'AnimalDetail'}>
                <Grid container justify="center">
                    <header id="title">Animal Detail</header>
                </Grid>
                <Paper >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Species</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell>Exhibit</TableCell>
                                <TableCell>Type</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={this.state.details[0]}>
                                <TableCell component="th" scope="row">
                                    {this.state.details[0]}
                                </TableCell>
                                <TableCell>{this.state.details[1]}</TableCell>
                                <TableCell numeric>{this.state.details[2]}</TableCell>
                                <TableCell>{this.state.details[3]}</TableCell>
                                <TableCell>{this.state.details[4]}</TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
                {this.renderRedirect()}
                <Button
                    variant="outlined"
                    color="secondary"
                    type="submit"
                    onClick={this.setRedirect}
                >
                    Back
                </Button>
            </div>
        )
    }
}

export default AnimalDetail;