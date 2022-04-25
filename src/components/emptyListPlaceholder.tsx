import { Typography } from "@mui/material";
import { TypographyProps } from "@mui/material/Typography/Typography";
import React from "react";

export const EmptyListPlaceholder = (props: TypographyProps) => (
  <Typography
    variant="h6"
    align="center"
    color="text.disabled"
    p={4}
    sx={{
      strong: {
        color: "primary.main",
      },
    }}
    {...props}
  />
);
