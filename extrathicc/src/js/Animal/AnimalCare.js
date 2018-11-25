import React, {Component} from "react";
import "../../css/Login.css";
import Button from "@material-ui/core/Button";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Grid} from "@material-ui/core";
import {query} from '../../utils.js';
import TextField from "@material-ui/core/TextField/TextField";
import CareTable from "./CareTable";
import moment from "moment";
import UserContext from "../../UserContext";
import {standardHandler} from "../../utils";

let counter = 0;

function createData(staff_username, note, log_time) {
    counter += 1;
    return {id: counter, staff_username, note, log_time};
}

class AnimalCare extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            name: '',
            species: '',
            age: 0,
            exhibit: '',
            type: '',
            notes: [],
            new_note:'',
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

    componentDidMount = () => {
        fetch(`http://localhost:5000/notes?${query({animal_name: this.props.match.params.name, 
                                                                animal_species: this.props.match.params.species})}`, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(standardHandler)
        .then(json => this.setState({
            notes: json.message.map(
                note => createData(
                    note.staff_username,
                    note.note,
                    moment.unix(note.log_time).format('MM/DD/YY hh:mm a')))
        }))
        .catch(response => {
            response.json().then(resp => alert(resp.message));
        });

    };

    handleLogNote = event => {
        const {match: {params: {name, species}}} = this.props;
        const {username} = this.context;
        fetch(`http://localhost:5000/notes?${query({animal_name: this.state.name, animal_species: this.state.species})}`, {

            method: 'POST',
            body: JSON.stringify({
                staff_username: username,
                log_time: moment().unix(),
                note: this.state.new_note,
                animal_name: name,
                animal_species: species
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(standardHandler)
        .then(response => alert(response.message))
        .then(response => fetch(`http://localhost:5000/notes?${query({animal_name: this.props.match.params.name,
            animal_species: this.props.match.params.species})}`, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }))
        .then(standardHandler)
        .then(json => this.setState({
            notes: json.message.map(
                note => createData(
                    note.staff_username,
                    note.note,
                    moment.unix(note.log_time).format('MM/DD/YY hh:mm a')))
        }))
        .catch(response => response.json().then(resp => alert(resp.message)));
        event.preventDefault();
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const {match: {params: {name, species}}} = this.props;
        return (
            <div className={'AnimalCare'}>
                <Grid container justify="center">
                    <header id="title">Animal Care</header>
                </Grid>
                <Paper>
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
                                <TableCell numeric>{this.state.age}</TableCell>
                                <TableCell>{this.state.exhibit}</TableCell>
                                <TableCell>{this.state.type}</TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="center"
                >
                    <TextField
                        label="Notes"
                        multiline
                        rowsMax="5"
                        value={this.state.new_note}
                        onChange={this.handleChange('new_note')}
                        margin="normal"
                        helperText="Notes about this animal"
                        variant="outlined"
                    />

                    <Button
                        variant="outlined"
                        color="secondary"
                        type="submit"
                        onClick={this.handleLogNote}
                    >
                        Log Notes
                    </Button>
                </Grid>
                <CareTable notes={this.state.notes}/>


            </div>
        )
    }
}

export default AnimalCare;