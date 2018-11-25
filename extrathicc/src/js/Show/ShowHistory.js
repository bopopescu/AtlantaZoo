import React, { Component } from "react";
import "../../css/Login.css";
import UserContext from "../../UserContext";
import moment from "moment";
import {standardHandler} from "../../utils";
import {Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import {DatePicker} from "material-ui-pickers";
import Paper from "@material-ui/core/Paper/Paper";
import HistoryTable from "../Show/HistoryTable";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import {query} from '../../utils';

const exhibits = [
    {
        value: '',
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

class ShowHistory extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            redirect: false,
            exhibit_name: '',
            show_name:'',
            search_time: null,
            filters:[]
        };
    }

    generateFilters = () => {
        let filters = [];

        const {exhibit_name, show_name, search_time} = this.state;

        if (exhibit_name !== '') {
            filters.push(row => row.exhibit_name.toLowerCase().includes(exhibit_name.toLowerCase()));
        }
        if (show_name !== '') {
            filters.push(row => row.show_name.toLowerCase().includes(show_name.toLowerCase()));
        }
        if (search_time !== null) {
            filters.push(row => moment.unix(row.visit_time).isSame(search_time, 'day'));
        }
        return filters;
    };

    componentDidMount = () => {
        fetch(`http://localhost:5000/visit_show?${query({visitor_username:this.context.username})}`, {
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

    render() {
        return (
            <div className={'Exhibit'}>
                <Grid container justify="center">
                    <header id="title">Show History</header>
                </Grid>
                <Grid container
                      direction="row"
                      justify="space-around"
                      alignItems="center">
                    <TextField
                        id="show"
                        label="Show Name"
                        placeholder="Show name"
                        onChange={this.handleChange('show_name')}
                        margin="normal"
                        variant="outlined"
                        value={this.state.show_name}
                    />

                    <TextField
                        id="exhibit"
                        select
                        label="Exhibit Name"
                        value={this.state.exhibit_name}
                        onChange={this.handleChange('exhibit_name')}
                        helperText="Select an exhibit"
                        margin="normal"
                        variant="outlined"
                    >
                        {exhibits.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <DatePicker clearable={true} value={this.state.search_time} onChange={this.handleDateChange} />

                </Grid>

                <Paper >
                    <HistoryTable shows={this.state.rows} filters={this.generateFilters()}> </HistoryTable>
                </Paper>
            </div>
        );
    }
}

export default ShowHistory;