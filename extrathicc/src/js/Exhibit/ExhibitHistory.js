import React, { Component } from "react";
import "../../css/Login.css";
import {query, standardHandler} from "../../utils";
import {Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Paper from "@material-ui/core/Paper/Paper";
import HistoryTable from "./HistoryTable";
import moment from "moment";
import {DatePicker} from "material-ui-pickers";
import UserContext from "../../UserContext";
import Button from "@material-ui/core/Button/Button";

class ExhibitHistory extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            redirect: false,
            exhibit_name: '',
            min_num_visits: '',
            max_num_visits: '',
            search_time: null,
        };
    }

    generateFilters = () => {
        let filters = {};
        filters.visitor_username = this.context.username;
        const {exhibit_name, min_num_visits, max_num_visits, search_time} = this.state;

        if (exhibit_name !== '') {
            filters.exhibit_name = exhibit_name;
        }
        if (min_num_visits !== '') {
            filters.min_visits = min_num_visits;
        }
        if (max_num_visits !== '') {
            filters.max_visits = max_num_visits;
        }
        if (search_time !== null) {
            filters.time = search_time.unix();
        }
        return filters;
    };

    componentDidMount = () => {
        this.refreshTable();
    };

    refreshTable = () => {
        fetch(`http://localhost:5000/visit_exhibit?${query(this.generateFilters())}`, {
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
    handleDateChange = date => {
        this.setState({ search_time: date });
    };

    handleClick = event => {
        this.refreshTable();
    };

    render() {
        return (
            <div className={'Exhibit'}>
                <Grid container justify="center">
                    <header id="title">Exhibit History</header>
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

                    <DatePicker clearable={true} value={this.state.search_time} onChange={this.handleDateChange} />

                </Grid>
                <Grid container
                      direction="row"
                      justify="space-around"
                      alignItems="center">

                    <TextField
                        id="outlined-number"
                        label="Min Num Visits"
                        value={this.state.min_num_visits}
                        onChange={this.handleChange('min_num_visits')}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        id="outlined-number"
                        label="Max Num Visits"
                        value={this.state.max_num_visits}
                        onChange={this.handleChange('max_num_visits')}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                    />

                    <Button
                        variant="outlined"
                        type="submit"
                        onClick={this.handleClick}
                    >
                        Search
                    </Button>
                </Grid>

                <Paper >
                    <HistoryTable exhibits={this.state.rows} refreshFunc={this.refreshTable}> </HistoryTable>
                </Paper>
            </div>
        );
    }
}

export default ExhibitHistory;