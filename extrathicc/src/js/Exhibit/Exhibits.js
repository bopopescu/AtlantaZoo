import React, { Component } from "react";
import "../../css/Login.css";
import Paper from '@material-ui/core/Paper';
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ExhibitTable from './ExhibitTable';
import Button from "@material-ui/core/Button/Button";

class Exhibits extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [{ name: "Name", size: 1, numAnimal: 2, water: 'YES' }], // query all of the shows
            redirect: false,
            exhibit: "",
            min_num_animals: 0,
            max_num_animals: 0,
            water_feature: true,
            api: ''
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    /**
     * @todo: update api
     */
    handleClick = () => {
        this.setState({
            api: '',
        });
    };

    render() {
        return (
            <div className={'Exhibit'}>
                <Grid container justify="center">
                    <header id="title">Exhibits</header>
                </Grid>
                <Grid container
                    direction="row"
                    justify="space-around"
                    alignItems="center">
                    <TextField
                        id="name"
                        label="Name"
                        placeholder="Exhibit name"
                        //onChange={this.handleChange}
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
                        label="Min Num Animals"
                        value={this.state.age}
                        onChange={this.handleChange('age')}
                        type="number"
                        className={"abc"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        id="outlined-number"
                        label="Max Num Animals"
                        value={this.state.age}
                        onChange={this.handleChange('age')}
                        type="number"
                        className={"abc"}
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

                    <TextField
                        id="outlined-number"
                        label="Min Size"
                        value={this.state.age}
                        onChange={this.handleChange('age')}
                        type="number"
                        className={"abc"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        id="outlined-number"
                        label="Max Size"
                        value={this.state.age}
                        onChange={this.handleChange('age')}
                        type="number"
                        className={"abc"}
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
                        <InputLabel>Water Feature</InputLabel>
                        <Select
                            value={this.state.water_feature}
                            onChange={this.handleChange('water_feature')}
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
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

                <Paper >
                    <ExhibitTable> </ExhibitTable>
                </Paper>
            </div>
        );
    }
}

export default Exhibits;