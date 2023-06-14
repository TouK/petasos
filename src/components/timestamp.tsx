import { Divider, styled, Typography } from "@mui/material";
import moment from "moment";
import React, { useMemo } from "react";

const Line = styled(Divider)(({ theme }) => ({
    position: "absolute",
    top: 0,
    right: 0,
    flex: 1,
    margin: 0,
    alignItems: "center",
    "::before, ::after": {
        borderTopStyle: "solid",
    },
    "::before": {
        width: "100%",
        borderImageSlice: 1,
        borderImageSource: `linear-gradient(to left, ${theme.palette.divider}, rgba(0, 0, 0, 0))`,
    },
    "::after": {
        width: theme.spacing(8),
    },
}));

export function Timestamp({ timestamp }: { timestamp?: string | number }): JSX.Element {
    const value = useMemo(() => (timestamp ? moment(timestamp).toISOString() : null), [timestamp]);

    if (!value) {
        return null;
    }

    return (
        <Line textAlign="right">
            <Typography variant="caption" color="action.disabled">
                {value}
            </Typography>
        </Line>
    );
}
