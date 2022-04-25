import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  styled,
  Tooltip,
} from "@mui/material";
import { IconButtonProps } from "@mui/material/IconButton/IconButton";
import { observer } from "mobx-react-lite";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { ContentBox } from "./contentBox";

export const GroupsList = observer(() => {
  const { groups, dialogs } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const switchGroup = (group = "") => {
    group ? searchParams.set("group", group) : searchParams.delete("group");
    setSearchParams(searchParams);
  };

  const selectedGroup = searchParams.get("group");

  return (
    <ContentBox>
      <List component="nav" disablePadding>
        <ListItem
          disablePadding
          sx={{ color: !selectedGroup && "text.disabled" }}
        >
          <ListItemButton onClick={() => switchGroup(null)}>
            <ListItemText
              primary={"All groups"}
              secondary={<>{groups.allTopicsList.length} topics</>}
              secondaryTypographyProps={{
                variant: "caption",
              }}
            />
          </ListItemButton>
        </ListItem>
        {groups.names.map((group: string) => (
          <ListItem
            key={group}
            disablePadding
            sx={{ color: selectedGroup === group && "primary.light" }}
          >
            <ListItemButton onClick={() => switchGroup(group)}>
              <ListItemText
                primary={group}
                secondary={<>{groups.getTopicsForGroup(group).length} topics</>}
                secondaryTypographyProps={{
                  variant: "caption",
                }}
              />
              <Stack direction="row" ml={2}>
                <IconButtonWithTooltip
                  size="small"
                  onClick={() =>
                    dialogs.topic.open({
                      topic: null,
                      group: group,
                    })
                  }
                  tooltipText="Add new topic to group"
                >
                  <AddIcon fontSize="small" />
                </IconButtonWithTooltip>
                {groups.isGroupRemoveAllowed && (
                  <IconButtonWithTooltip
                    size="small"
                    onClick={() => {
                      dialogs.deleteGroupDialog.open({ group });
                    }}
                    disabled={groups.getTopicsForGroup(group).length > 0}
                    tooltipText={
                      groups.getTopicsForGroup(group).length > 0
                        ? "Only empty groups can be deleted"
                        : "Delete group"
                    }
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButtonWithTooltip>
                )}
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </ContentBox>
  );
});

// workaround for tooltip on disabled button from:
// https://stackoverflow.com/questions/61115913/is-is-possible-to-render-a-tooltip-on-a-disabled-material-ui-button-within-a
const IconButtonWithPointerEvents = styled(IconButton)({
  "&.Mui-disabled": {
    pointerEvents: "auto",
  },
});

interface IconButtonWithTooltipProps extends IconButtonProps {
  tooltipText: string;
}

const IconButtonWithTooltip = ({
  tooltipText,
  onClick,
  ...props
}: IconButtonWithTooltipProps) => {
  const adjustedButtonProps = props.disabled
    ? { component: "div" }
    : { onClick };
  return (
    <Tooltip title={tooltipText} placement="top">
      <IconButtonWithPointerEvents {...props} {...adjustedButtonProps} />
    </Tooltip>
  );
};
