import AddIcon from "@mui/icons-material/Add";
import { Breadcrumbs, Button, Link, Skeleton, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { PropsWithChildren, ReactNode } from "react";
import {
  Link as RouterLink,
  matchPath,
  PathMatch,
  useLocation,
} from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { LayoutRow } from "./layout";

function LinkRouter(
  props: PropsWithChildren<{
    to: string;
  }>
) {
  return (
    <Link
      underline="hover"
      color="inherit"
      {...props}
      component={RouterLink as any}
    />
  );
}

const displayNameGet =
  (matchers: Record<string, (match: PathMatch) => ReactNode>) =>
  (to: string) => {
    const [match] = Object.keys(matchers)
      .map((pattern) => matchPath(pattern, to))
      .filter(Boolean);
    return matchers[match?.pattern.path]?.(match);
  };

function Placeholder({ length }: { length: number }) {
  return (
    <Skeleton
      variant="text"
      width={`${length}ex`}
      animation="wave"
      sx={{
        bgcolor: "background.paper",
        opacity: (t) => t.palette.action.selectedOpacity,
      }}
    />
  );
}

export const NavigationBar = observer(() => {
  const { topics, groups, dialogs } = useStore();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const homeText = groups.areGroupsHidden ? "Topics list" : "Groups and topics";

  const nameGetter = displayNameGet({
    "/:topic": (match) => {
      return (
        topics.getTopicDisplayName?.(match?.params.topic) || (
          <Placeholder length={match?.params.topic.length} />
        )
      );
    },
    "/:topic/:subscription": (match) => match?.params.subscription,
  });

  return (
    <LayoutRow justifyContent="space-between" alignItems="baseline">
      <Breadcrumbs
        sx={{
          color: (t) => t.palette.background.paper,
        }}
      >
        {pathnames.length ? (
          <LinkRouter to="/">{homeText}</LinkRouter>
        ) : (
          <Typography>{homeText}</Typography>
        )}

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          return last ? (
            <Typography key={to} fontWeight="bold">
              {nameGetter(to)}
            </Typography>
          ) : (
            <LinkRouter to={to} key={to}>
              {nameGetter(to)}
            </LinkRouter>
          );
        })}
      </Breadcrumbs>
      <Button
        color="primary"
        variant="contained"
        onClick={() => dialogs.topic.open({ topic: null })}
        startIcon={<AddIcon />}
        disabled={!groups.fetchTask.resolved}
      >
        Add topic
      </Button>
    </LayoutRow>
  );
});
