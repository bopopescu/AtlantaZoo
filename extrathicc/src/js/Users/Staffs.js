import React, { Component } from "react";
import "../../css/Login.css";
import { Grid } from "@material-ui/core";
import UserTable from "./UserTable";
import TextField from "@material-ui/core/TextField/TextField";
import {query, standardHandler} from "../../utils";
import Button from "@material-ui/core/Button/Button";

class Staffs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email:'',
            filters:[],
            rows:[]
        }
    }

    componentDidMount = () => {
        this.refreshTable();
    };

    refreshTable = () => {
        fetch(`http://localhost:5000/users?${query(this.generateFilters())}`, {

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

    generateFilters = () => {
        let filters = {};
        filters.user_type = 'Staff';

        const {username, email} = this.state;

        if (username !== '') {
            filters.username = username;
        }
        if (email !== '') {
            filters.email = email;
        }
        return filters;
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
            <div className={'Users'}>
                <Grid container justify="center">
                    <header id="title">View Staff</header>
                </Grid>

                <Grid container
                      direction="row"
                      justify="space-around"
                      alignItems="center">
                    <TextField
                        label="Username"
                        placeholder="Username"
                        onChange={this.handleChange('username')}
                        margin="normal"
                        variant="outlined"
                        value={this.state.exhibit_name}
                    />

                    <TextField
                        label="Email"
                        placeholder="Email"
                        onChange={this.handleChange('email')}
                        margin="normal"
                        variant="outlined"
                        value={this.state.email}
                    />
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

                <UserTable
                    users={this.state.rows}
                    refreshFunc={this.refreshTable}>
                </UserTable>
            </div>
        );
    }
}

export default Staffs;