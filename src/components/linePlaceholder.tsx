import { Skeleton } from "@mui/material";
import type { SkeletonProps } from "@mui/material/Skeleton/Skeleton";
import React from "react";

interface Props extends Pick<SkeletonProps, "sx"> {
  length?: number;
  dark?: boolean;
}

export function LinePlaceholder(props: Props) {
  const { length = 15, dark, ...passProps } = props;
  return (
    <Skeleton
      variant="text"
      width={`${length}ex`}
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
