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

const rows = [
    {id: 'exhibit_name', numeric: false, disablePadding: true, label: 'Name'},
    {id: 'visit_time', numeric: true, disablePadding: false, label: 'Time'},
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
        this.props.sortFunc(orderBy, order);
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const {classes, exhibits} = this.props;
        const {order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, exhibits.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <SharedTableHead
                            data={rows}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            rowCount={exhibits.length}
                        />
                        <TableBody>
                            {exhibits
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((n, id) => {
                                    const isSelected = this.isSelected(id);
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={id}
                                        >
                                            <TableCell/>
                                            <TableCell component="th" scope="row" padding="none">
                                                <Link to={`/exhibitdetail/${n.exhibit}`}>
                                                    {n.exhibit}
                                                </Link>
                                            </TableCell>
                                            <TableCell padding="default">{moment.unix(n.visit_time).format('MM/DD/YY hh:mm a')}</TableCell>
                                            <TableCell padding="default">{n.num_visits}</TableCell>
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