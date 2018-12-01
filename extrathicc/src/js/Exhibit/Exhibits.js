import React, { Component } from "react";
import "../../css/Login.css";
import Paper from '@material-ui/core/Paper';
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ExhibitTable from './ExhibitTable';
import {query, standardHandler} from "../../utils";
import Button from "@material-ui/core/Button/Button";
import ShowTable from "../Show/ShowTable";


class Exhibits extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            redirect: false,
            exhibit_name: '',
            min_num_animals: '',
            max_num_animals: '',
            min_size: '',
            max_size: '',
            water_feature: '',
        };
    }

    generateFilters = () => {
        let filters = [];

        const {exhibit_name, min_num_animals, max_num_animals, min_size, max_size, water_feature} = this.state;

        if (exhibit_name !== '') {
            filters.push(row => row.exhibit_name.toLowerCase().includes(exhibit_name.toLowerCase()));
        }
        if (min_num_animals !== '') {
            filters.push(row => row.total_animals >= min_num_animals);
        }
        if (max_num_animals !== '') {
            filters.push(row => row.total_animals <= max_num_animals);
        }
        if (min_size !== '') {
            filters.push(row => row.size >= min_size);
        }
        if (max_size !== '') {
            filters.push(row => row.size <= max_size);
        }
        if (water_feature !== '') {
            filters.push(row => !!row.water_feature === water_feature);
        }
        return filters;
    };

    generateFilters = () => {
        let filters = {};

        const {exhibit_name, min_num_animals, max_num_animals, min_size, max_size, water_feature} = this.state;

        if (exhibit_name !== '') {
            filters.exhibit_name = exhibit_name;
        }
        if (min_num_animals !== '') {
            filters.min_animal_num = min_num_animals;
        }
        if (max_num_animals!== '') {
            filters.max_animal_num= max_num_animals;
        }
        if (min_size !== '') {
            filters.min_size = min_size;
        }
        if (max_size !== '') {
            filters.max_size = max_size;
        }
        if (exhibit_name !== '') {
            filters.water_feature = water_feature;
        }

        return filters;
    };

    generateSort = (sortBy, orderDir) => {
        let sort = {};

        const {exhibit_name, min_num_animals, max_num_animals, min_size, max_size, water_feature} = this.state;

        sort.sort=sortBy;
        sort.orderDir = orderDir;

        if (exhibit_name !== '') {
            sort.exhibit_name = exhibit_name;
        }
        if (min_num_animals !== '') {
            sort.min_animal_num = min_num_animals;
        }
        if (max_num_animals!== '') {
            sort.max_animal_num= max_num_animals;
        }
        if (min_size !== '') {
            sort.min_size = min_size;
        }
        if (max_size !== '') {
            sort.max_size = max_size;
        }
        if (exhibit_name !== '') {
            sort.water_feature = water_feature;
        }

        return sort;
    };

    componentDidMount = () => {
        this.refreshTable();
    };

    refreshTable = () => {
        fetch(`http://localhost:5000/exhibits?${query(this.generateFilters())}`, {
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
        fetch(`http://localhost:5000/exhibits?${query(this.generateSort(sortBy, orderDir))}`, {
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
            [name]: event.target.value
        });
    };

    handleClick = event => {
        this.refreshTable();
    };

    render() {
        return (
            <div className={'Exhibit'}>
                <Grid container justify="center">
                    <header id="title">Exhibits</header>
                </Grid>
                <Grid container
                    direction="row"
                    justify="space-around"
                    alignItems="center">
                    <TextField
                        id="name"
                        label="Name"
                        placeholder="Exhibit name"
                        onChange={this.handleChange('exhibit_name')}
                        margin="normal"
                        variant="outlined"
                        value={this.state.exhibit_name}
                    />
                </Grid>
                <Grid container
                    direction="row"
                    justify="space-around"
                    alignItems="center">

                    <TextField
                        id="outlined-number"
                        label="Min Num Animals"
                        value={this.state.min_num_animals}
                        onChange={this.handleChange('min_num_animals')}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        id="outlined-number"
                        label="Max Num Animals"
                        value={this.state.max_num_animals}
                        onChange={this.handleChange('max_num_animals')}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                    />
                </Grid>

                <Grid container
                    direction="row"
                    justify="space-around"
                    alignItems="center">

                    <TextField
                        id="outlined-number"
                        label="Min Size"
                        value={this.state.min_size}
                        onChange={this.handleChange('min_size')}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        id="outlined-number"
                        label="Max Size"
                        value={this.state.max_size}
                        onChange={this.handleChange('max_size')}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                    />
                </Grid>

                <Grid container
                    direction="row"
                    justify="space-around"
                    alignItems="center">
                    <FormControl>
                        <InputLabel>Water Feature</InputLabel>
                        <Select
                            value={this.state.water_feature}
                            onChange={this.handleChange('water_feature')}
                        >
                            <MenuItem value={''}/>
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
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

                <Paper >
                    <ExhibitTable
                        exhibits={this.state.rows}
                        refreshFunc={this.refreshTable}
                        sortFunc={this.sortColumn}>
                    > </ExhibitTable>
                </Paper>
            </div>
        );
    }
}

export default Exhibits;