import React, { Component } from "react";
import "../../css/Login.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect } from "react-router-dom";
import { DateTimePicker } from 'material-ui-pickers';
import moment from 'moment';

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
            datetime: moment(),
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
        return this.validateName()
            && this.validateTime()
            && this.validateStaff()
            && this.validateExhibit();
    }

    validateName() {
        return this.state.name.length > 0;
    }
    validateStaff() {
        return this.state.staff.length > 0;
    }
    validateExhibit() {
        return this.state.exhibit.length > 0
    }
    validateTime() {
        return this.state.datetime > moment()
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
        if (!this.validateExhibit()) {
            alert("Missing Exhibit");
            event.preventDefault();
            return ""
        }
        if (!this.validateStaff()) {
            alert("Missing Staff Name");
            event.preventDefault();
            return ""
        }
        if (!this.validateTime()) {
            alert("Invalid Date");
            event.preventDefault();
            return ""
        }
        fetch('http://localhost:5000/shows',
            {
                method: 'POST',
                body: JSON.stringify({
                    show_name: this.state.name,
                    show_time: this.state.datetime.unix(),
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
            return <Redirect to="/adminhome" />;
        }
    };

    render() {
        let {name, exhibit, staff} = this.state;
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
                            required={true}
                            id="name"
                            label="Show Name"
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            margin="normal" />


                        <TextField
                            required={true}
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
                            required
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

                        <DateTimePicker value={this.state.datetime} onChange={this.handleDateChange} />
                    </Grid>

                    <Grid container direction="row" justify="center" alignItems="center">
                        <Button
                            variant="outlined"
                            type="submit"
                            // disabled={!this.validateForm()}
                            onSubmit={this.handleSubmit}
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