import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Chip,
  Divider,
  IconButton,
  List,
  ListItemText,
  styled,
  Tooltip,
} from "@mui/material";
import { IconButtonProps } from "@mui/material/IconButton/IconButton";
import { observer } from "mobx-react-lite";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import styles from "../styles/layout.css";
import { StyledListItem } from "./styledMuiComponents";

export const GroupsList = observer(() => {
  const { groups, dialogs } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const switchGroup = (group = "") => {
    group ? searchParams.set("group", group) : searchParams.delete("group");
    setSearchParams(searchParams);
  };

  const selectedGroup = searchParams.get("group");

  return (
    <div className={styles.LayoutBodySidebar}>
      <div className={styles.LayoutBodySidebarRow}>
        <div className={styles.LayerSectionHeader}>Groups</div>
        <List component="nav">
          <StyledListItem
            onClick={() => switchGroup(null)}
            selected={selectedGroup === null}
          >
            <ListItemText primary="All groups" />
          </StyledListItem>
          <Divider />
          {groups.names.map((group: string) => (
            <StyledListItem
              key={group}
              onClick={() => switchGroup(group)}
              selected={selectedGroup === group}
            >
              <ListItemText primary={group} />
              <span>
                <Tooltip title="Number of topics" placement="top">
                  <Chip
                    size="small"
                    color="secondary"
                    label={groups.getTopicsForGroup(group).length}
                  />
                </Tooltip>{" "}
                <Tooltip title="Add new topic to group" placement="top">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() =>
                      dialogs.topic.open({
                        topic: null,
                        group: group,
                      })
                    }
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>{" "}
                {groups.isGroupRemoveAllowed && (
                  <IconButtonWithTooltip
                    size="small"
                    color="primary"
                    disabled={groups.getTopicsForGroup(group).length > 0}
                    onClick={() => {
                      dialogs.deleteGroupDialog.open({ group });
                    }}
                    tooltipText={
                      groups.getTopicsForGroup(group).length > 0
                        ? "Only empty groups can be deleted"
                        : "Delete group"
                    }
                  >
                    <DeleteIcon />
                  </IconButtonWithTooltip>
                )}
              </span>
            </StyledListItem>
          ))}
        </List>
      </div>
    </div>
  );
});

// workaround for tooltip on disabled button from:
// https://stackoverflow.com/questions/61115913/is-is-possible-to-render-a-tooltip-on-a-disabled-material-ui-button-within-a
const AlteredIconButton = styled(IconButton)({
  root: {
    "&.Mui-disabled": {
      pointerEvents: "auto",
    },
  },
});

interface IconButtonWithTooltipProps extends IconButtonProps {
  tooltipText: string;
}

const IconButtonWithTooltip = ({
  tooltipText,
  disabled,
  onClick,
  ...other
}: IconButtonWithTooltipProps) => {
  const adjustedButtonProps = {
    disabled: disabled,
    component: disabled ? "div" : undefined,
    onClick: disabled ? undefined : onClick,
  };
  return (
    <Tooltip title={tooltipText} placement="top">
      <AlteredIconButton {...other} {...adjustedButtonProps} />
    </Tooltip>
  );
};
