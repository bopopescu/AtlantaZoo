import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import "../../css/Login.css";
import SharedTableHead from '../../SharedTableHead.jsx';
import SharedToolbar from '../../SharedToolbar.jsx';
import { Link } from "react-router-dom";
import UserContext from "../../UserContext";
import Button from "@material-ui/core/es/Button/Button";
import {standardHandler} from "../../utils";

function desc(a, b, orderBy) {
    a = Object.assign({}, a);
    b = Object.assign({}, b);
    if (typeof a[orderBy] === 'string') {
        a[orderBy] = a[orderBy].toLowerCase();
    }
    if (typeof b[orderBy] === 'string') {
        b[orderBy] = b[orderBy].toLowerCase();
    }
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

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

const allFilters = (filters, row) => {
    for (let filter of filters) {
        if (!filter(row)) {
            return false;
        }
    }
    return true;
};

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
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: state.animals.map(n => n.id) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
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
        const { classes, filters, animals } = this.props;
        const { order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, animals.length - page * rowsPerPage);
        const url = userType.toLowerCase() === 'staff' ? `/animalcare/` : `/animaldetail/`;
        return (
            <Paper className={classes.root}>
                <SharedToolbar numSelected={selected.length} title={'List of Animals'}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <SharedTableHead
                            data={rows}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={animals.length}
                        />
                        <TableBody>
                            {stableSort(animals, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .filter(row => allFilters(filters, row))
                                .map((n, id) => {
                                    // const isSelected = this.isSelected(id);
                                    return (
                                        <TableRow
                                            hover
                                            // onClick={event => this.handleClick(event, id)}
                                            // role="checkbox"
                                            // aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={id}
                                            // selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                {/*<Checkbox checked={isSelected} />*/}
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
                                            <TableCell >{n.species}</TableCell>
                                            <TableCell >
                                                <Link to={`/exhibitdetail/${n.exhibit_name}`} >
                                                    {n.exhibit_name}
                                                </Link>

                                                </TableCell>
                                            <TableCell numeric>{n.age}</TableCell>
                                            <TableCell >{n.animal_type}</TableCell>
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