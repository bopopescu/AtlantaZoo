import React, { Component } from "react";
import "../css/Login.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect } from "react-router-dom";
import { DateTimePicker } from 'material-ui-pickers';

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

class AddShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            name: "",
            exhibit: "",
            staff: "",
            datetime: new Date(),
            allStaff: [],
        };

        fetch('http://localhost:5000/staff', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(json => this.setState({ allStaff: json.message }));
    }

    validateForm() {
        return this.state.name.length > 0
            && this.state.species.length > 0
            && this.state.type.length > 0
            && this.state.age !== 0
            && this.state.exhibit.length > 0;
    }

    handleDateChange = date => {
        this.setState({ datetime: date });
    };

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
        fetch('http://localhost:5000/show',
            {
                method: 'POST',
                body: JSON.stringify({
                    show_name: this.state.name,
                    species: this.state.date.concat(" " + this.state.time),
                    staff_name: this.state.staff,
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
            .catch(error => console.error('Error adding a show:', error));
        event.preventDefault();
    };

    setRedirect = () => {
        this.setState({
            redirect: true
        });
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/home" />;
        }
    };

    render() {
        return (
            <div className="Login">
                <Grid container justify="center">
                    <header id="title">Add a Show</header>
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
                            label="Show Name"
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
                            id="staff"
                            select
                            label="Assign Staff"
                            value={this.state.staff}
                            onChange={this.handleChange('staff')}
                            helperText="Select one of the staff to host this show"
                            margin="normal"
                            variant="outlined"
                        >
                            {this.state.allStaff.map(option => (
                                <MenuItem key={option.username} value={option.username}>
                                    {option.username}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            id="date"
                            label="Birthday"
                            type="date"
                            defaultValue="2017-05-24"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <DateTimePicker value={this.state.datetime} onChange={this.handleDateChange} />
                    </Grid>



                    <Grid container direction="row" justify="center" alignItems="center">
                        <Button
                            variant="outlined"
                            type="submit"
                            disabled={!this.validateForm()}
                        >
                            Add Show
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

export default AddShow;