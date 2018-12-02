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
import "../../css/Login.css";
import SharedTableHead from '../../SharedTableHead.jsx';
import {query, standardHandler} from "../../utils";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography/Typography";
import {Link} from "react-router-dom";

const rows = [
    {id: 'animal_name', numeric: false, disablePadding: true, label: 'Name'},
    {id: 'species', numeric: true, disablePadding: false, label: 'Species'}
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

class DetailTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'animal_name',
            selected: [],
            exhibits: [],
            page: 0,
            rowsPerPage: 5,
        };
        fetch(`http://localhost:5000/animals?${query({exhibit_name: this.props.exhibit_name})}`, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(standardHandler)
            .then(response => this.setState({exhibits: response.message}))
            .catch(response => {
                response.json().then(resp => alert(resp.message));
            });
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
        this.sortColumn(orderBy, order);
    };

    sortColumn = (sortBy, orderDir) => {
        fetch(`http://localhost:5000/animals?${query(
            {
                exhibit_name: this.props.exhibit_name,
                sort: sortBy,
                orderDir: orderDir
            })}`, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(standardHandler)
            .then(response => this.setState({exhibits: response.message}))
            .catch(response => {
                response.json().then(resp => alert(resp.message));
            });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({selected: state.exhibits.map(n => n.id)}));
            return;
        }
        this.setState({selected: []});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const {classes, title} = this.props;
        const {exhibits, order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, exhibits.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Grid container justify="center">
                        <Typography variant="h6" id="tableTitle">
                            {title}
                        </Typography>
                    </Grid>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <SharedTableHead
                            data={rows}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                        />
                        <TableBody>
                            {exhibits
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n.id);
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={n.id}
                                        >
                                            <TableCell>

                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                <Link to={`/animaldetail/${n.animal_name}/${n.species}`} >
                                                    {n.animal_name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{n.species}</TableCell>
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

DetailTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DetailTable);