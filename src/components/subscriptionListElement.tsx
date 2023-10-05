import { Subscriptions as SubscriptionsIcon } from "@mui/icons-material";
import { Chip, CircularProgress, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Subscription } from "../store/subscription";
import { LinePlaceholder } from "./linePlaceholder";

export const SubscriptionListElement = observer(({ subscription }: { subscription: Subscription }) => {
    const navigate = useNavigate();
    const state = subscription.state;
    const noExist = state === undefined;
    const notActive = state !== "ACTIVE" && state !== undefined;
    const active = state === "ACTIVE";

    useEffect(() => {
        let interval;
        if (noExist) {
            subscription.fetchTask();
        } else if (notActive) {
            interval = setInterval(() => subscription.fetchTask(), 10000);
        } else if (active) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [subscription, noExist, notActive, active]);

    return (
        <ListItemButton onClick={() => navigate(subscription.name)}>
            <ListItemIcon>
                <SubscriptionsIcon />
            </ListItemIcon>
            <ListItemText
                primary={subscription.name}
                secondary={subscription.description || !subscription.fetchTask.pending ? subscription.description : <LinePlaceholder />}
            />
            <Chip
                size="small"
                color={subscription.fetchTask.resolved ? (subscription.state === "ACTIVE" ? "success" : "warning") : "default"}
                variant="outlined"
                label={subscription.fetchTask.resolved ? `${subscription.state}` : "•••"}
                icon={!subscription.fetchTask.resolved ? <CircularProgress size="1em" /> : null}
            />
        </ListItemButton>
    );
});
