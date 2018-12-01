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
import {DatePicker} from "material-ui-pickers";
import {query, standardHandler} from "../../utils";

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
            rows:[],
        };
    }

    generateFilters = () => {
        let filters = {};

        const {exhibit_name, show_name, search_time} = this.state;

        if (exhibit_name !== '') {
            filters.exhibit_name = exhibit_name;
        }
        if (show_name !== '') {
            filters.show_name = show_name;
        }
        if (search_time !== null) {
            filters.show_time = search_time.unix();
        }
        return filters;
    };

    generateSort = (sortBy, orderDir) => {
        let sort = {};
        const {exhibit_name, show_name, search_time} = this.state;

        sort.sort = sortBy;
        sort.orderDir = orderDir;
        if (exhibit_name !== '') {
            sort.exhibit_name = exhibit_name;
        }
        if (show_name !== '') {
            sort.show_name = show_name;
        }
        if (search_time !== null) {
            sort.show_time = search_time.unix();
        }
        return sort;

    };

    componentDidMount = () => {
        this.refreshTable();
    };

    refreshTable = () => {
        fetch(`http://localhost:5000/shows?${query(this.generateFilters())}`, {
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

    sortColumn = (sortBy, orderDir) => {
        fetch(`http://localhost:5000/shows?${query(this.generateSort(sortBy, orderDir))}`, {
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
            this.setState({
                [name]: event.target.value,
            });
    };

    handleDateChange = date => {
        this.setState({ search_time: date });
    };

    handleClick = event => {
        this.refreshTable();
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
                        value={this.state.show_name}
                        margin="normal"
                        variant="outlined"
                    />

                    <DatePicker label="Date" clearable={true} value={this.state.search_time} onChange={this.handleDateChange} />

                </Grid>

                <Grid container
                      direction="row"
                      justify="space-around"
                      alignItems="center">
                    <FormControl>
                        <InputLabel>Exhibit</InputLabel>
                        <Select
                            value={this.state.exhibit_name}
                            onChange={this.handleChange('exhibit_name')}
                        >
                            {exhibits.map(exhibit => (
                                <MenuItem key={exhibit.value} value={exhibit.value}>
                                    {exhibit.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        type="submit"
                        onClick={this.handleClick}
                    >
                        Search
                    </Button>
                </Grid>

                <ShowTable
                    show_names={this.state.rows}
                    refreshFunc={this.refreshTable}
                    sortFunc={this.sortColumn}>
                </ShowTable>
            </div>
        );
    }
}

export default Shows;