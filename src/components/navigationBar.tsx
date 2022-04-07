import AddIcon from "@mui/icons-material/Add";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Observer, useObserver } from "mobx-react-lite";
import React, { PropsWithChildren } from "react";
import {
  Link as RouterLink,
  matchPath,
  PathMatch,
  useLocation,
} from "react-router-dom";
import { useStore } from "../store/storeProvider";
import layout from "../styles/layout.css";
import { LayoutBodyRow } from "./layoutBodyContent";
import { StyledButton } from "./styledMuiComponents";

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

const RouterBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const { topics, groups, dialogs } = useStore();
  const breadcrumbNameMap = (to: string) => {
    return to.split("/").pop();
  };

  return (
    <Observer>
      {() => {
        const homeText = groups.areGroupsHidden
          ? "Topics list"
          : "Groups and topics";

        return (
          <Breadcrumbs aria-label="breadcrumb">
            <LinkRouter to="/">{homeText}</LinkRouter>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;

              return last ? (
                <Typography color="text.primary" key={to}>
                  {breadcrumbNameMap(to)}
                </Typography>
              ) : (
                <LinkRouter to={to} key={to}>
                  {breadcrumbNameMap(to)}
                </LinkRouter>
              );
            })}
          </Breadcrumbs>
        );
      }}
    </Observer>
  );
};

const displayNameGet =
  (matchers: Record<string, (match: PathMatch) => string>) => (to: string) => {
    const [match] = Object.keys(matchers)
      .map((pattern) => matchPath(pattern, to))
      .filter(Boolean);
    return matchers[match?.pattern.path]?.(match);
  };

export const NavigationBar = () => {
  const { topics, groups, dialogs } = useStore();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return useObserver(() => {
    const homeText = groups.areGroupsHidden
      ? "Topics list"
      : "Groups and topics";

    const nameGetter = displayNameGet({
      "/:topic": (match) => topics.getTopicDisplayName(match?.params.topic),
    });

    return (
      <LayoutBodyRow>
        <div className={layout.LayoutNavigationBreadcrumbs}>
          <Breadcrumbs aria-label="breadcrumb">
            {pathnames.length ? (
              <LinkRouter to="/">{homeText}</LinkRouter>
            ) : (
              <Typography color="text.primary">{homeText}</Typography>
            )}

            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              return last ? (
                <Typography color="text.primary" key={to}>
                  {nameGetter(to) || value}
                </Typography>
              ) : (
                <LinkRouter to={to} key={to}>
                  {nameGetter(to) || value}
                </LinkRouter>
              );
            })}
          </Breadcrumbs>
        </div>
        <div className={layout.LayoutNavigationButton}>
          <StyledButton
            color="secondary"
            variant="contained"
            onClick={() => dialogs.topic.open({ topic: null })}
            startIcon={<AddIcon />}
            disabled={!groups.fetchTask.resolved}
          >
            Add topic
          </StyledButton>
        </div>
      </LayoutBodyRow>
    );
  });
};
