import React, { Component } from "react";
import "../../css/Login.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect } from "react-router-dom";
import moment from "moment";

const exhibits = [
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

class AddAnimal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            name: "",
            exhibit: "",
            type: "",
            species: "",
            age: "",
        };
    }

    validateType() {
        return this.state.type.length > 0;
    }
    validateExhibit() {
        return this.state.exhibit.length > 0
    }
    validateAge() {
        return this.state.age != 0;
    }
    handleChange = name => event => {
        if (name === 'age') {
            this.setState({
                age: event.target.value < 0 ? 0 : event.target.value
            });
        } else {
            this.setState({
                [name]: event.target.value
            });
        }


    };

    handleSubmit = event => {
        if (!this.validateExhibit()) {
            alert("Missing Exhibit");
            event.preventDefault();
            return ""
        }
        if (!this.validateType()) {
            alert("Missing Animal Type");
            event.preventDefault();
            return ""
        }
        if (!this.validateAge()) {
            alert("Age can't be Zero");
            event.preventDefault();
            return ""
        }
        fetch('http://localhost:5000/animals',
            {
                method: 'POST',
                body: JSON.stringify({
                    animal_name: this.state.name,
                    species: this.state.species,
                    animal_type: this.state.type,
                    age: this.state.age,
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
            .catch(error => console.error('Error:', error));
        event.preventDefault();
    };

    setRedirect = () => {
        this.setState({
            redirect: true
        });
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/adminhome" />;
        }
    };

    render() {
        return (
            <div className="Login">
                <Grid container justify="center">
                    <header id="title">Add an Animal</header>
                </Grid>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <TextField
                            required
                            id="name"
                            label="Name"
                            placeholder="Animal Name"
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            margin="normal" />


                        <TextField
                            id="exhibit"
                            select
                            label="Exhibit Name"
                            value={this.state.exhibit}
                            onChange={this.handleChange('exhibit')}
                            helperText="Select an exhibit you want to add this animal to"
                            margin="normal"
                            variant="outlined"
                        >
                            {exhibits.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            id="animal_type"
                            select
                            label="Animal Type"
                            value={this.state.type}
                            onChange={this.handleChange('type')}
                            helperText="Select the type of this animal"
                            margin="normal"
                            variant="outlined"
                        >
                            {animal_types.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            required
                            id="species"
                            label="Animal Species"
                            placeholder="Animal species"
                            value={this.state.species}
                            onChange={this.handleChange('species')}
                            margin="normal" />

                        <TextField
                            id="age"
                            placeholder="Age"
                            value={this.state.age}
                            onChange={this.handleChange('age')}
                            type="number"
                            InputLabelProps={{
                                shrink: false,
                            }}
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid container direction="row" justify="center" alignItems="center">
                        <Button
                            variant="outlined"
                            type="submit"
                        >
                            Add
                </Button>

                        {this.renderRedirect()}
                        <Button
                            variant="outlined"
                            color="secondary"
                            type="submit"
                            onClick={this.setRedirect}
                        >
                            Cancel
                </Button>
                    </Grid>
                </form>
            </div>
        );
    }

}

export default AddAnimal;