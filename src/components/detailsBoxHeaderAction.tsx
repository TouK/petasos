import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import { ButtonProps } from "@mui/material/Button/Button";
import React, { ReactNode } from "react";

export interface ActionButtonProps extends Omit<ButtonProps, "onClick" | "children" | "startIcon"> {
    Icon: ReactNode;
    action: () => void;
    label: string;
    pending?: boolean;
}

function ActionButton({ label, action, Icon, pending = null, ...props }: ActionButtonProps) {
    const commonProps: ButtonProps = {
        startIcon: Icon,
        onClick: action,
        children: label,
        ...props,
    };

    return pending === null ? <Button {...commonProps} /> : <LoadingButton {...commonProps} loading={pending} loadingPosition="start" />;
}

export const DetailsHeaderAction = (props: ActionButtonProps) => <ActionButton variant="outlined" color="inherit" {...props} />;

export const DetailsBoxHeaderAction = (props: ActionButtonProps) => <ActionButton variant="text" color="inherit" size="small" {...props} />;
