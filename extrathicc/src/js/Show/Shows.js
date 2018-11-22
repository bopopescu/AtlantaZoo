import React, { Component } from "react";
import "../../css/Login.css";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ShowTable from './ShowTable.jsx';
import Button from "@material-ui/core/Button";
import moment from "moment";
import {DateTimePicker} from "material-ui-pickers";

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

class Shows extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            name: '',
            exhibit: '',
            search_time: moment(),
            api: 'http://localhost:5000/shows',
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

    handleDateChange = date => {
        this.setState({ search_time: date });
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
            <div className={'Shows'}>
                <Grid container justify="center">
                    <header id="title">Shows</header>
                </Grid>
                <Grid container
                      direction="row"
                      justify="space-around"
                      alignItems="center">
                    <TextField
                        id="name"
                        label="Name"
                        placeholder="Show name"
                        onChange={this.handleChange('name')}
                        margin="normal"
                        variant="outlined"
                    />

                    <DateTimePicker value={this.state.search_time} onChange={this.handleDateChange} />

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

                    <Button
                        variant="outlined"
                        type="submit"
                        onClick={this.handleClick}
                    >
                        Search
                    </Button>
                </Grid>


                <ShowTable
                    api={this.state.api}>
                </ShowTable>
            </div>
        );
    }
}

export default Shows;