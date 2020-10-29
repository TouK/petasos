import React from "react"
import HelpIcon from '@material-ui/icons/Help';
import {DarkTooltip, SmallIconButton} from "./styledMuiComponents";

export const InfoPopover = ({info}: { info: string }) => {

    return (
        <DarkTooltip title={info} placement="left">
            <SmallIconButton size="small" type="button"
                                 color="primary"><HelpIcon/></SmallIconButton>
        </DarkTooltip>
    )
}