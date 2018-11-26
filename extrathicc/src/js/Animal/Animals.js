import React, { Component } from "react";
import "../../css/Login.css";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import AnimalTable from './AnimalTable.jsx';
import Button from "@material-ui/core/Button";
import {standardHandler} from "../../utils";

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

const animal_types = [
    {
        value: '', // not to search by type
        label: '',
    },
    {
        value: 'mammal',
        label: 'Mammal',
    },
    {
        value: 'bird',
        label: 'Bird',
    },
    {
        value: 'amphibian',
        label: 'Amphibian',
    },
    {
        value: 'reptile',
        label: 'Reptile',
    },
    {
        value: 'fish',
        label: 'Fish',
    },
    {
        value: 'invertebrate',
        label: 'Invertebrate',
    },
];

class Animals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            animal_name: '',
            type: '',
            species: '',
            min_age: '',
            max_age: '',
            exhibit_name: '',
            rows:[],
        };
    }

    generateFilters = () => {
        let filters = [];

        const {animal_name, type, species, min_age, max_age, exhibit_name} = this.state;

        if (animal_name !== '') {
            filters.push(row => row.animal_name.toLowerCase().includes(animal_name.toLowerCase()));
        }
        if (min_age !== '') {
            filters.push(row => row.age >= min_age);
        }
        if (max_age !== '') {
            filters.push(row => row.age <= max_age);
        }
        if (type !== '') {
            filters.push(row => row.animal_type.toLowerCase() === type.toLowerCase());
        }
        if (species !== '') {
            filters.push(row => row.species.toLowerCase().includes(species.toLowerCase()));
        }
        if (exhibit_name !== '') {
            filters.push(row => row.exhibit_name.toLowerCase() === exhibit_name.toLowerCase());
        }
        return filters;
    };

    componentDidMount = () => {
        this.refreshFunction();
    };

    refreshFunction = () => {
        fetch(`http://localhost:5000/animals`, {
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


    render() {
        return (
            <div className={'Animal'}>
                <Grid container justify="center">
                    <header id="title">Animals</header>
                </Grid>
                <Grid container
                    direction="row"
                    justify="space-around"
                    alignItems="center">
                    <TextField
                        id="animal_name"
                        label="Name"
                        placeholder="Animal name"
                        onChange={this.handleChange('animal_name')}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        id="species"
                        label="Species"
                        placeholder="Animal Species"
                        onChange={this.handleChange('species')}
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
                        label="Minimum Age"
                        value={this.state.min_age}
                        onChange={this.handleChange('min_age')}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        id="outlined-number"
                        label="Maximum Age"
                        value={this.state.max_age}
                        onChange={this.handleChange('max_age')}
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

                    <FormControl>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={this.state.type}
                            onChange={this.handleChange('type')}
                        >
                            {animal_types.map(type => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <AnimalTable
                    animals={this.state.rows}
                    filters={this.generateFilters()}
                    refreshFunc={this.refreshFunction}>
                </AnimalTable>
            </div>
        );
    }
}

export default Animals;