import { LoadingButton } from "@mui/lab";
import {
  Button,
  Collapse,
  Divider,
  Fade,
  Stack,
  Typography,
} from "@mui/material";
import React, { PropsWithChildren, useState } from "react";
import { LayoutRow } from "./layout";
import { ActionButtonProps } from "./topicDetails";

function HeadElement(props: {
  text: string;
  onClick: () => void;
  collapsed?: boolean;
}) {
  const { text, onClick, collapsed } = props;
  return (
    <Typography
      variant="subtitle2"
      color={collapsed ? "text.secondary" : "text.primary"}
      onClick={onClick}
    >
      {text}
    </Typography>
  );
}

export function DetailsBox(
  props: PropsWithChildren<{
    header: string;
    actions?: ActionButtonProps[];
  }>
) {
  const { header, children, actions = [] } = props;
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed(!collapsed);

  return (
    <Stack spacing={1} flex={1}>
      {actions.filter(Boolean).length ? (
        <LayoutRow justifyContent="space-between" alignItems="baseline">
          <HeadElement text={header} onClick={toggle} collapsed={collapsed} />
          <Fade in={!collapsed} unmountOnExit>
            <div>
              {actions
                .filter(Boolean)
                .map(({ label, action, Icon, pending = null, ...props }) =>
                  pending === null ? (
                    <Button
                      key={label}
                      size="small"
                      color="inherit"
                      variant="text"
                      startIcon={Icon}
                      onClick={action}
                      {...props}
                    >
                      {label}
                    </Button>
                  ) : (
                    <LoadingButton
                      key={label}
                      size="small"
                      color="inherit"
                      variant="text"
                      startIcon={Icon}
                      onClick={action}
                      loading={pending}
                      loadingPosition="start"
                    >
                      {label}
                    </LoadingButton>
                  )
                )}
            </div>
          </Fade>
        </LayoutRow>
      ) : (
        <HeadElement text={header} onClick={toggle} collapsed={collapsed} />
      )}
      <Fade in={!collapsed}>
        <Divider light />
      </Fade>
      <Collapse in={!collapsed} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Stack>
  );
}
