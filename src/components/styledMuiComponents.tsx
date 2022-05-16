import { Dialog, IconButton, styled, Tooltip } from "@mui/material";

export const SmallIconButton = styled(IconButton)({
  ".MuiSvgIcon-root": {
    fontSize: "1.0rem",
  },
});

export const DarkTooltip = styled(Tooltip)({
  arrow: {
    color: "#000000",
  },
  tooltip: {
    backgroundColor: "#404040",
  },
});

export const StyledDialog = Dialog;
