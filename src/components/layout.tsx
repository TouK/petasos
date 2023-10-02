import { Stack } from "@mui/material";
import type { StackProps } from "@mui/material/Stack/Stack";
import React from "react";

export const LayoutRow = (props: StackProps) => <Stack direction="row" alignItems="flex-start" spacing={2} {...props} />;

export const LayoutColumn = (props: StackProps) => <Stack flex={1} spacing={2} {...props} />;

export const ActionsRow = (props: StackProps) => <LayoutRow spacing={1} justifyContent="flex-end" {...props} />;
