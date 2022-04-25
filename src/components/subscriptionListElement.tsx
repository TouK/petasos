import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import {
  Chip,
  CircularProgress,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Subscription } from "../store/subscription";

export const SubscriptionListElement = observer(
  ({ subscription }: { subscription: Subscription }) => {
    const navigate = useNavigate();

    useEffect(() => {
      subscription.fetchTask();
    }, [subscription]);

    return (
      <ListItemButton onClick={() => navigate(subscription.name)}>
        <ListItemIcon>
          <SubscriptionsIcon />
        </ListItemIcon>
        <ListItemText
          primary={subscription.name}
          secondary={subscription.description}
        />
        <Chip
          size="small"
          color={subscription.state === "ACTIVE" ? "success" : "warning"}
          variant="outlined"
          label={
            subscription.fetchTask.resolved ? (
              `${subscription.state}`
            ) : (
              <CircularProgress size={15} />
            )
          }
        />
      </ListItemButton>
    );
  }
);
