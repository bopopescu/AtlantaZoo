import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import "../../css/Login.css";
import SharedTableHead from '../../SharedTableHead.jsx';
import moment from "moment";
import SharedToolbar from '../../SharedToolbar.jsx';
import {Link} from "react-router-dom";
import UserContext from "../../UserContext";
import { query } from '../../utils.js';
import {standardHandler} from "../../utils";


function desc(a, b, orderBy) {
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
    {id: 'show_name', numeric: false, disablePadding: true, label: 'Name'},
    {id: 'show_time', numeric: false, disablePadding: true, label: 'Times'},
    {id: 'exhibit_name', numeric: false, disablePadding: true, label: 'Exhibit'}
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

class ShowTable extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'show_name',
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

        this.setState({order, orderBy});
    };

    // handleSelectAllClick = event => {
    //     if (event.target.checked) {
    //         this.setState(state => ({selected: state.shows.map(n => n.id)}));
    //         return;
    //     }
    //     this.setState({selected: []});
    // };

    handleClick = (event, id) => {
        const {selected} = this.state;
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

        this.setState({selected: newSelected});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleAction = row => event => {
        if (this.context.userType.toLowerCase() === 'visitor') {
            if (row.time <= moment()) {
                fetch('http://localhost:5000/visit_show',
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            show_name: row.name,
                            show_time: row.time,
                            visitor_username: this.context.username
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            response.json().then(resp => alert("You've successfully logged a visit"));
                        } else {
                            response.json().then(resp => alert("You've already logged a visit"));
                        }
                    })
                    .catch(error => console.error('Error logging a visit to a show:', error));
                event.preventDefault();
            }
        } else if (this.context.userType.toLowerCase() === 'admin') {
            fetch(`http://localhost:5000/shows/${encodeURIComponent(row.name)}/${encodeURIComponent(row.time)}`, {

                method: 'DELETE',
                body: JSON.stringify({
                    show_name: row.name,
                    show_time: row.time
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
        }

    };

    render() {
        const {classes, filters, show_names} = this.props;
        const {order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, show_names.length - page * rowsPerPage);
        const {userType} = this.context;
        return (
            <Paper className={classes.root}>
                <SharedToolbar numSelected={selected.length} title={'List of Shows'}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <SharedTableHead
                            data={rows}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            // onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={show_names.length}
                        />
                        <TableBody>
                            {stableSort(show_names, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .filter(row => allFilters(filters, row))
                                .map((n, id) => {
                                    const isSelected = this.isSelected(id);
                                    return (
                                        <TableRow
                                            hover
                                            // onClick={event => this.handleClick(event, n.id)}
                                            // aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={id}
                                            selected={isSelected}
                                        >
                                            <TableCell>
                                                <Button variant="outlined" color="secondary" className={classes.button}
                                                        onClick={this.handleAction(
                                                            {
                                                                name: n.show_name,
                                                                time: n.show_time,
                                                                exhibit: n.exhibit_name
                                                            })}>
                                                    {userType === 'visitor' ? 'Log Visit' : 'Remove'}
                                                </Button>
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.show_name}
                                            </TableCell>
                                            <TableCell>{moment.unix(n.show_time).format('MM/DD/YY hh:mm a')}</TableCell>
                                            <TableCell>
                                                <Link to={`/exhibitdetail/${n.exhibit_name}`}>
                                                    {n.exhibit_name}
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 49 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={show_names.length}
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
        )
    }
}

ShowTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShowTable);