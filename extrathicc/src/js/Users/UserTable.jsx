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
import {query} from '../../utils.js';
import {standardHandler} from "../../utils";


const rows = [
    {id: 'username', numeric: false, disablePadding: true, label: 'Username'},
    {id: 'email', numeric: false, disablePadding: true, label: 'Email'}
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

class UserTable extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'username',
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

    handleDelete = row => event => {
        fetch(`http://localhost:5000/users/${encodeURIComponent(row.username)}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(standardHandler)
            .then(response => alert(response.message))
            .then(response => fetch(`http://localhost:5000/users?${query({user_type: this.props.user_type})}`, {

                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }))
            .then(standardHandler)
            .then(response => this.setState({users: response.message}))
            .then(response => this.props.refreshFunc())
            .catch(response => response.json().then(resp => alert(resp.message)));
        event.preventDefault();
    };

    render() {
        const {users, classes} = this.props;
        const {order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

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
                            {users
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
                                            <TableCell>
                                                <Button variant="outlined" color="secondary" className={classes.button}
                                                        onClick={this.handleDelete(
                                                            {
                                                                username: n.username,
                                                                email: n.email
                                                            })}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.username}
                                            </TableCell>
                                            <TableCell padding="none">{n.email}</TableCell>
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
                    count={users.length}
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

UserTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserTable);