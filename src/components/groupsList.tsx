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
import { useObserver } from "mobx-react-lite";
import React from "react";
import { useStore } from "../store/storeProvider";
import styles from "../styles/layout.css";
import { StyledListItem } from "./styledMuiComponents";

export const GroupsList = () => {
  const { groups, topics, dialogs } = useStore();

  return useObserver(() => {
    const switchGroup = (groupName: string) => {
      groups.changeSelectedGroup(groupName);
      topics.changeSelectedTopic(null);
    };

    const openModalWithDefaultGroup = (groupName: string) => {
      groups.changeDefaultGroup(groupName);
      dialogs.topic.setOpen(true);
    };

    return (
      <div className={styles.LayoutBodySidebar}>
        <div className={styles.LayoutBodySidebarRow}>
          <div className={styles.LayerSectionHeader}>Groups</div>
          <List component="nav">
            <StyledListItem
              onClick={() => switchGroup(null)}
              selected={groups.selectedGroup === null}
            >
              <ListItemText primary="All groups" />
            </StyledListItem>
            <Divider />
            {groups.names.map((group: string) => (
              <StyledListItem
                key={group}
                onClick={() => switchGroup(group)}
                selected={groups.selectedGroup === group}
              >
                <ListItemText primary={group} />
                <span>
                  <Tooltip title="Number of topics" placement="top">
                    <Chip
                      size="small"
                      color="secondary"
                      label={groups.topicsPerGroup.get(group).length}
                    />
                  </Tooltip>{" "}
                  <Tooltip title="Add new topic to group" placement="top">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openModalWithDefaultGroup(group)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>{" "}
                  <IconButtonWithTooltip
                    size="small"
                    color="primary"
                    disabled={groups.topicsPerGroup.get(group).length > 0}
                    onClick={() =>
                      dialogs.deleteGroupDialog.setGroupToBeDeleted(group)
                    }
                    tooltipText={
                      groups.topicsPerGroup.get(group).length > 0
                        ? "Only empty groups can be deleted"
                        : "Delete group"
                    }
                  >
                    <DeleteIcon />
                  </IconButtonWithTooltip>
                </span>
              </StyledListItem>
            ))}
          </List>
        </div>
      </div>
    );
  });
};

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
