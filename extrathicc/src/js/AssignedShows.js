import React, { Component } from "react";
import "../css/Login.css";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class AssignedShows extends Component {
    render() {
        let id = 0;
        return (
            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell numeric>Size</TableCell>
                            <TableCell numeric>Number of Animals</TableCell>
                            <TableCell>Water</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.rows.map(row => {
                            return (
                                <TableRow key={id++}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell numeric>{row.size}</TableCell>
                                    <TableCell numeric>{row.numAnimal}</TableCell>
                                    <TableCell>{row.water}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

export default AssignedShows;