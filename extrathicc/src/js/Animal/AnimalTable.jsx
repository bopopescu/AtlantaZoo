import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import "../../css/Login.css";
import SharedTableHead from '../../SharedTableHead.jsx';
import SharedToolbar from '../../SharedToolbar.jsx';
import { Link } from "react-router-dom";
import UserContext from "../../UserContext";
import Button from "@material-ui/core/es/Button/Button";
import {standardHandler} from "../../utils";

const rows = [
    { id: 'animal_name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'species', numeric: false, disablePadding: true, label: 'Species' },
    { id: 'exhibit_name', numeric: false, disablePadding: true, label: 'Exhibit' },
    { id: 'age', numeric: true, disablePadding: false, label: 'Age (month)' },
    { id: 'animal_type', numeric: false, disablePadding: true, label: 'Type' },
];

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class AnimalTable extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'animal_name',
            selected: [],
            page: 0,
            rowsPerPage: 5,
        };
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
        this.props.sortFunc(orderBy, order);
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleRender = row => {
        if (this.context.userType.toLowerCase() === 'admin') {
            return (
                <Button variant="outlined" color="secondary" onClick={this.handleRemove(row)}>
                    Remove
                </Button>
            )
        }
    };

    handleRemove = row => event => {
        fetch(`http://localhost:5000/animals/${encodeURIComponent(row.name)}/${encodeURIComponent(row.species)}`, {

            method: 'DELETE',
            body: JSON.stringify({
                animal_name: row.name,
                species: row.species
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(standardHandler)
            .then(response => this.setState({rows: response.message}))
            .then(response => this.props.refreshFunc())
            .catch(response => {
                response.json().then(resp => alert(resp.message));
            });
    };

    render() {
        const {userType} = this.context;
        const { classes, animals } = this.props;
        const { order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, animals.length - page * rowsPerPage);
        const url = userType.toLowerCase() === 'staff' ? `/animalcare/` : `/animaldetail/`;
        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <SharedTableHead
                            data={rows}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                        />
                        <TableBody>
                            {animals
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((n, id) => {
                                    const isSelected = this.isSelected(id);
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={id}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                {this.handleRender({
                                                    name: n.animal_name,
                                                    species: n.species
                                                })}
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                <Link to={url +`${n.animal_name}/${n.species}`} >
                                                    {n.animal_name}
                                                </Link>
                                            </TableCell>
                                            <TableCell padding="none">{n.species}</TableCell>
                                            <TableCell padding="none">
                                                <Link to={`/exhibitdetail/${n.exhibit_name}`} >
                                                    {n.exhibit_name}
                                                </Link>

                                                </TableCell>
                                            <TableCell padding="default">{n.age}</TableCell>
                                            <TableCell padding="none">{n.animal_type}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={animals.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

AnimalTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AnimalTable);