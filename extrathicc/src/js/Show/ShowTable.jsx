import React from 'react';
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
import {Link} from "react-router-dom";
import UserContext from "../../UserContext";
import {standardHandler} from "../../utils";

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
        this.props.sortFunc(orderBy, order);
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
            if (moment.unix(row.time).isBefore(moment())) {
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
                    .then(standardHandler)
                    .then(resp => alert(resp.message))
                    .catch(resp => resp.json().then(resp => alert(resp.message)));
                event.preventDefault();
            } else {
                alert("Show has not happened yet");
                event.preventDefault();
                return ""
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
        console.log(this.props);
        const {classes, show_names} = this.props;
        const {order, orderBy, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, show_names.length - page * rowsPerPage);
        const {userType} = this.context;
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
                            {show_names
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
                                                        onClick={this.handleAction(
                                                            {
                                                                name: n.show_name,
                                                                time: n.show_time,
                                                                exhibit: n.exhibit_name
                                                            })}>
                                                    {userType.toLowerCase() === 'visitor' ? 'Log Visit' : 'Remove'}
                                                </Button>
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.show_name}
                                            </TableCell>
                                            <TableCell padding='none'>{moment.unix(n.show_time).format('MM/DD/YY hh:mm a')}</TableCell>
                                            <TableCell padding='none'>
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
    sortFunc: PropTypes.func.isRequired,
};

export default withStyles(styles)(ShowTable);