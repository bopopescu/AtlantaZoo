import React, { Component } from "react";
import "../../css/Login.css";
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
import DetailTable from "./DetailTable";
import {query} from "../../utils";
import UserContext from "../../UserContext";

class ExhibitDetail extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            animals: [],
            current_time: moment(),
            redirect: false
        };
        const {match: {params: {name}}} = this.props;

        fetch(`http://localhost:5000/exhibits?${query({exhibit_name: name})}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(json => this.setState({ details: json.message }));
    }

    handleLog = event => {
        fetch('http://localhost:5000/visit_exhibit',
            {
                method: 'POST',
                body: JSON.stringify({
                    visitor_username: this.context.username,
                    visit_time: this.state.current_time.unix(),
                    exhibit_name: this.props.match.params.name
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    response.json().then(resp => alert("Successfully log a visit"));
                } else {
                    response.json().then(resp => alert("You already logged a visit"));
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
                                    <TableRow key={detail.exhibit_name}>
                                        <TableCell component="th" scope="row">
                                            {detail.exhibit_name}
                                        </TableCell>
                                        <TableCell>{detail.size}</TableCell>
                                        <TableCell>{detail.total_animals}</TableCell>
                                        <TableCell>{detail.water_feature ? 'Yes' : 'No'}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    <form autoComplete="off" >
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Button
                                variant="outlined"
                                type="submit"
                                onClick={this.handleLog}
                            >
                                Log Visit
                            </Button>
                        </Grid>
                    </form>

                    <DetailTable
                        title={'Animals in this Exhibit'}
                        exhibit_name={this.props.match.params.name}/>
                </Paper>

            </div >
        );
    }
}
export default ExhibitDetail;