import React, { Component } from "react";
import "../../css/Login.css";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ShowTable from './ShowTable.jsx';
import Button from "@material-ui/core/Button";
import moment from "moment";
import {DateTimePicker} from "material-ui-pickers";
import {standardHandler} from "../../utils";
import ExhibitTable from "../Exhibit/ExhibitTable";

const exhibits = [
    {
        value: '', // not to search by exhibit
        label: '',
    },
    {
        value: 'Pacific',
        label: 'Pacific',
    },
    {
        value: 'Jungle',
        label: 'Jungle',
    },
    {
        value: 'Sahara',
        label: 'Sahara',
    },
    {
        value: 'Mountainous',
        label: 'Mountainous',
    },
    {
        value: 'Birds',
        label: 'Birds',
    },
];

class Shows extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            show_name: '',
            exhibit_name: '',
            search_time: null,
            rows:[]
        };
    }

    generateFilters = () => {
        let filters = [];

        const {exhibit_name, show_name, search_time} = this.state;

        if (exhibit_name !== '') {
            filters.push(row => row.exhibit_name.toLowerCase().includes(exhibit_name.toLowerCase()));
        }
        if (show_name !== '') {
            filters.push(row => row.show_name.toLowerCase().includes(show_name.toLowerCase()));
        }
        if (search_time !== null) {
            filters.push(row => row.show_time > moment());
        }
        return filters;
    };

    componentDidMount = () => {
        fetch(`http://localhost:5000/shows`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(standardHandler)
            .then(response => this.setState({rows: response.message}))
            .catch(response => {
                response.json().then(resp => alert(resp.message));
            });
    };

    handleChange = name => event => {
        if (name === 'min_age' || name === 'max_age') {
            this.setState({
                [name]: event.target.value < 0 ? 0 : event.target.value
            });
        } else {
            this.setState({
                [name]: event.target.value
            });
        }

    };

    handleDateChange = date => {
        this.setState({ search_time: date });
    };

    render() {
        return (
            <div className={'Shows'}>
                <Grid container justify="center">
                    <header id="title">Shows</header>
                </Grid>
                <Grid container
                      direction="row"
                      justify="space-around"
                      alignItems="center">
                    <TextField
                        id="show_name"
                        label="Name"
                        placeholder="Show name"
                        onChange={this.handleChange('show_name')}
                        margin="normal"
                        variant="outlined"
                    />

                    <DateTimePicker clearable={true} value={this.state.search_time} onChange={this.handleDateChange} />

                </Grid>

                <Grid container
                      direction="row"
                      justify="space-around"
                      alignItems="center">
                    <FormControl>
                        <InputLabel>Exhibit</InputLabel>
                        <Select
                            value={this.state.exhibit_name}
                            onChange={this.handleChange('exhibit')}
                        >
                            {exhibits.map(exhibit => (
                                <MenuItem key={exhibit.value} value={exhibit.value}>
                                    {exhibit.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>


                <ShowTable
                    show_names={this.state.rows}
                    filters={this.generateFilters()}>
                </ShowTable>
            </div>
        );
    }
}

export default Shows;