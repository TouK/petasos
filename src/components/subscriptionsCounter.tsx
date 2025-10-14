import { CircularProgress, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Topic } from "../store/topic";

export const SubscriptionsCounter = observer(({ topic }: { topic: Topic }) => {
    useEffect(() => {
        topic.fetchSubscriptionsTask();
    }, [topic]);

    const size = topic.subscriptionsMap.size;
    return (
        <Typography
            variant="caption"
            sx={(theme) => ({
                color: size < 1 ? theme.palette.action.disabled : "inherit",
            })}
        >
            {topic.fetchSubscriptionsTask.resolved ? (
                size === 1 ? (
                    "1 subscription"
                ) : (
                    `${size || "no"} subscriptions`
                )
            ) : (
                <CircularProgress size={15} color="inherit" />
            )}
        </Typography>
    );
});
