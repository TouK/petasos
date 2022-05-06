import { Divider, styled, Typography } from "@mui/material";
import moment from "moment";
import React, { useMemo } from "react";

function getMessageTimestamp(content: string): string | null {
  try {
    const data = JSON.parse(content);
    const timestamp = data.__metadata.timestamp;
    return timestamp ? moment(parseInt(timestamp)).toISOString() : null;
  } catch {
    return null;
  }
}

const Line = styled(Divider)(({ theme }) => ({
  flex: 1,
  mx: 2,
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

export function Timestamp({ message }: { message?: string }): JSX.Element {
  const timestamp = useMemo(() => getMessageTimestamp(message), [message]);

  if (!timestamp) {
    return null;
  }

  return (
    <Line textAlign="right">
      <Typography variant="caption" color="action.disabled">
        {timestamp}
      </Typography>
    </Line>
  );
}
