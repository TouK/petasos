import { Skeleton } from "@mui/material";
import { SkeletonProps } from "@mui/material/Skeleton/Skeleton";
import React from "react";

interface Props extends Pick<SkeletonProps, "sx"> {
  length?: number | string;
  dark?: boolean;
}

export function LinePlaceholder(props: Props) {
  const { length = "15em", dark, ...passProps } = props;
  return (
    <Skeleton
      variant="text"
      width={length}
      animation="wave"
      sx={
        dark && {
          bgcolor: "background.paper",
          opacity: (t) => t.palette.action.selectedOpacity,
        }
      }
      {...passProps}
    />
  );
}
