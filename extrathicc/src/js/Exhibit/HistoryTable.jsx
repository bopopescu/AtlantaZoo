import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import "../../css/Login.css";
import SharedTableHead from '../../SharedTableHead.jsx';
import SharedToolbar from '../../SharedToolbar.jsx';
import {Link} from "react-router-dom";
import moment from "moment";

let counter = 0;

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
    {id: 'exhibit_name', numeric: false, disablePadding: true, label: 'Name'},
    {id: 'time', numeric: true, disablePadding: false, label: 'Time'},
    {id: 'num_visits', numeric: true, disablePadding: false, label: 'Number of visits'},
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

class HistoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'exhibit_name',
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
    //         this.setState(state => ({selected: state.exhibits.map(n => n.id)}));
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

    render() {
        const {classes, exhibits, filters} = this.props;
        const {order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, exhibits.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <SharedToolbar numSelected={selected.length} title={this.props.title}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <SharedTableHead
                            data={rows}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            // onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={exhibits.length}
                        />
                        <TableBody>
                            {stableSort(exhibits, getSorting(order, orderBy))
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
                                            // selected={isSelected}
                                        >
                                            <TableCell/>
                                            <TableCell component="th" scope="row" padding="none">
                                                <Link to={`/exhibitdetail/${n.exhibit}`}>
                                                    {n.exhibit}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{moment.unix(n.visit_time).format('MM/DD/YY hh:mm a')}</TableCell>
                                            <TableCell>{n.num_visits}</TableCell>
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
                    count={exhibits.length}
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

HistoryTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HistoryTable);