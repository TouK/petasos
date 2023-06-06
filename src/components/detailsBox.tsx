import { Collapse, Fade, Stack, Typography } from "@mui/material";
import React, { PropsWithChildren, useState } from "react";
import { ActionButtonProps, DetailsBoxHeaderAction } from "./detailsBoxHeaderAction";
import { LayoutRow } from "./layout";

function HeadElement(props: { text: string; onClick: () => void; collapsed?: boolean }) {
    const { text, onClick, collapsed } = props;
    return (
        <Typography variant="subtitle1" color={collapsed ? "text.secondary" : "text.primary"} onClick={onClick}>
            {text}
        </Typography>
    );
}

export function DetailsBox(
    props: PropsWithChildren<{
        header: string;
        actions?: ActionButtonProps[];
    }>,
) {
    const { header, children, actions = [] } = props;
    const [collapsed, setCollapsed] = useState(false);

    const toggle = () => setCollapsed(!collapsed);
    const filteredActions = actions.filter(Boolean);

    return (
        <Stack spacing={1} flex={1}>
            {filteredActions.length ? (
                <LayoutRow justifyContent="space-between" alignItems="center">
                    <HeadElement text={header} onClick={toggle} collapsed={collapsed} />
                    <Fade in={!collapsed} unmountOnExit>
                        <div>
                            {filteredActions.map((action) => (
                                <DetailsBoxHeaderAction key={action.label} {...action} />
                            ))}
                        </div>
                    </Fade>
                </LayoutRow>
            ) : (
                <HeadElement text={header} onClick={toggle} collapsed={collapsed} />
            )}
            <Collapse in={!collapsed} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </Stack>
    );
}
