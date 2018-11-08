import React, { Component } from "react";
import "../css/Login.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';

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

class AddAnimal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            name: "",
            exhibit: "",
            type: "",
            species: "",
            age: 0,
        };
    }

    validateForm() {
        return this.state.name.length > 0
            && this.state.species.length > 0
            && this.state.type.length > 0
            && this.state.age !== 0
            && this.state.exhibit.length > 0;
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handleSubmit = event => {
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
        // if (this.state.redirect) {
        //     return <Redirect to="/home" />;
        // }
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
                            SelectProps={{
                                MenuProps: {

                                },
                            }}
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
                    </Grid>
                    <Grid container direction="row" justify="center" alignItems="center">
                        <Button
                            variant="outlined"
                            type="submit"
                            disabled={!this.validateForm()}
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