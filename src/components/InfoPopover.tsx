import HelpIcon from "@mui/icons-material/Help";
import React from "react";
import { DarkTooltip, SmallIconButton } from "./styledMuiComponents";

export const InfoPopover = ({ info }: { info: string }) => {
  return (
    <DarkTooltip title={info} placement="left">
      <SmallIconButton size="small" type="button" color="primary">
        <HelpIcon />
      </SmallIconButton>
    </DarkTooltip>
  );
};
