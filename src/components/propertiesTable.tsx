import React from "react"
import {Table, TableBody, TableCell, TableContainer, TableRow} from "@material-ui/core";
import {StyledPaper} from "./styledMuiComponents";
import {InfoPopover} from "./InfoPopover";

export const PropertiesTable = ({properties}: { properties: PropertiesTableRow[] }) =>
    <TableContainer component={StyledPaper}>
        <Table size="small">
            <TableBody>
                {properties.map(row => row && (
                    <TableRow key={row.name}>
                        <TableCell align="right">{row.name}</TableCell>
                        <TableCell>{row.value}</TableCell>
                        <TableCell>{row.info && <InfoPopover info={row.info}/>}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>

export const createRow = (name: string, value: string, info: string = undefined): PropertiesTableRow => {
    return {name, value, info}
}

export class PropertiesTableRow {
    name: string;
    value: string;
    info: string;
}