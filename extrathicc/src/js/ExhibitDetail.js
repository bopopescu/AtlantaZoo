import React, { Component } from "react";
import "../css/Login.css";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Button from '@material-ui/core/Button';

class ExhibitDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: [],
            animals: [],
            current_time: moment(),
            redirect: false
        };
        /**
         * @todo: Update api to get a specific exhibit details
         */
        fetch('http://localhost:5000/exhibits/Exh_ID', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(json => this.setState({ details: json.message }));

        /**
         * @todo: Update api to get animals for a specific exhibit
         */
        fetch('http://localhost:5000/animals/exhibit', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(json => this.setState({ animals: json.message }));
    }

    /**
     * @todo: Update api to create a visit
     * @todo: fix the visitor_username by the the shared context
     */
    handleSubmit = event => {
        fetch('http://localhost:5000/exhibit/visit',
            {
                method: 'POST',
                body: JSON.stringify({
                    visitor_username: this.state.name,
                    visit_time: this.state.datetime.unix(),
                    exhibit_name: this.state.exhibit
                }),
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
            .catch(error => console.error('Error adding a show:', error));
        event.preventDefault();
    };


    render() {
        return (
            <div className={'ExhibitDetail'}>
                <Grid container justify="center">
                    <header id="title">Exhibit Detail</header>
                </Grid>
                <Paper >
                    <Typography variant="h6" id="tableTitle">
                        Information
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Number of Animals</TableCell>
                                <TableCell>Water Feature</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.details.map(detail => {
                                return (
                                    <TableRow key={detail.name}>
                                        <TableCell component="th" scope="row">
                                            {detail.exhibit_name}
                                        </TableCell>
                                        <TableCell>{detail.size}</TableCell>
                                        <TableCell>{detail.total_animal}</TableCell>
                                        <TableCell>{detail.size}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    <Typography variant="h6" id="tableTitle">
                        List of Animals in this Exhibit
                    </Typography>
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
                                    <TableRow key={animal.animal_name.concat(animal.species)}>
                                        <TableCell component="th" scope="row">
                                            {animal.animal_name}
                                        </TableCell>
                                        <TableCell>{animal.water_feature === true ? 'YES' : 'NO'}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                    <Grid container direction="row" justify="center" alignItems="center">
                        <Button
                            variant="outlined"
                            type="submit"
                        >
                            Log Visit
                        </Button>
                    </Grid>
                </form>
            </div >
        );
    }
}
export default ExhibitDetail;