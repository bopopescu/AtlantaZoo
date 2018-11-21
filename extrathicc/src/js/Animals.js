import React, { Component } from "react";
import "../css/Login.css";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import AnimalTable from './AnimalTable.jsx';
import Button from "@material-ui/core/Button";

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
            name: '',
            type: '',
            species: '',
            min_age: 0,
            max_age: 0,
            exhibit: '',
            api: 'http://localhost:5000/animals',
            search_object: null,
        };
    }

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

    /**
     * @todo: update api 
     */
    handleClick = () => {
        this.setState({
            api: '',
            // search_object: {
            //     name: this.state.name,
            //     type: this.state.type,
            //     species: this.state.species,
            //     min_age: this.state.min_age,
            //     max_age: this.state.max_age,
            //     exhibit: this.state.exhibit
            // }
        });
    }

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
                        id="name"
                        label="Name"
                        placeholder="Animal name"
                        onChange={this.handleChange('name')}
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
                            value={this.state.exhibit}
                            onChange={this.handleChange('exhibit')}
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

                <Grid container
                    direction="row"
                    justify="space-around"
                    alignItems="center">

                    <Button
                        variant="outlined"
                        type="submit"
                        onClick={this.handleClick}
                    >
                        Search
                    </Button>

                </Grid>
                <AnimalTable
                    // search_field={this.state.search_object}
                    api={this.state.api}>
                </AnimalTable>
            </div>
        );
    }
}

export default Animals;