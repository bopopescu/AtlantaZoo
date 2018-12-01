import React, { Component } from "react";
import "../../css/Login.css";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid } from "@material-ui/core";
import { query } from '../../utils.js';

class AnimalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            name:'',
            species: '',
            age: 0,
            exhibit: '',
            type: ''
        };
        const {match: {params: {name, species}}} = this.props;
        fetch(`http://localhost:5000/animals?${query({name, species})}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.json();
        })
        .then(json => json.message[0])
        .then(json => this.setState({
            name: json.animal_name,
            species: json.species,
            age: json.age,
            exhibit: json.exhibit_name,
            type: json.animal_type,
        }));
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/animals" />;
        }
    };
    setRedirect = event => {
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
                            <TableRow key={this.state.name}>
                                <TableCell component="th" scope="row">
                                    {this.state.name}
                                </TableCell>
                                <TableCell>{this.state.species}</TableCell>
                                <TableCell>{this.state.age}</TableCell>
                                <TableCell>{this.state.exhibit}</TableCell>
                                <TableCell>{this.state.type}</TableCell>

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