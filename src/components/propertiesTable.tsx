import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  TypographyProps,
} from "@mui/material";
import React, { ReactNode } from "react";
import { InfoPopover } from "./InfoPopover";
import { LinePlaceholder } from "./topics";

const TBody = ({
  properties,
  ...props
}: { properties: PropertiesTableRow[] } & Pick<TypographyProps, "color">) => (
  <TableBody>
    {properties.filter(Boolean).map((row) => (
      <TableRow key={row.name}>
        <TableCell align="right" width="35%">
          <Typography {...props} color="text.disabled" variant="subtitle2">
            {row.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography {...props} variant="subtitle2">
            {row.value}
            {row.info && <InfoPopover info={row.info} />}
          </Typography>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
);

export const PropertiesTable = ({
  properties,
  advancedProperties,
}: {
  properties: PropertiesTableRow[];
  advancedProperties?: PropertiesTableRow[];
}) => (
  <TableContainer>
    <Table
      size="small"
      sx={{
        ".MuiTableCell-root": {
          border: 0,
        },
      }}
    >
      <TBody properties={properties} />
      {!!advancedProperties?.length && (
        <TBody properties={advancedProperties} color="warning.dark" />
      )}
    </Table>
  </TableContainer>
);

export const createRow = (
  name: string,
  value: ReactNode,
  info: string = undefined
): PropertiesTableRow => {
  return {
    name,
    value: value || <LinePlaceholder />,
    info,
  };
};

export class PropertiesTableRow {
  name: string;
  value: ReactNode;
  info: string;
}
