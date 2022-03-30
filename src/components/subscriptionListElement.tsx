import { NavigateNext } from "@mui/icons-material";
import { CardContent, Chip, CircularProgress, IconButton } from "@mui/material";
import { useObserver } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useStore } from "../store/storeProvider";
import { Subscription } from "../store/subscription";
import styles from "../styles/details.css";
import layout from "../styles/layout.css";
import { StyledTopicCard } from "./styledMuiComponents";

export const SubscriptionListElement = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  const { topics } = useStore();
  useEffect(() => {
    subscription.fetchTask();
  }, [subscription]);

  return useObserver(() => {
    return (
      <StyledTopicCard key={subscription.name}>
        <CardContent>
          <div className={layout.Row}>
            <div className={layout.Column}>
              <div className={styles.DetailsName}>{subscription.name}</div>
              <div className={styles.DetailsUrl}>
                Endpoint:{" "}
                <b>
                  {subscription.fetchTask.resolved ? (
                    subscription.endpoint
                  ) : (
                    <CircularProgress size={15} />
                  )}
                </b>
              </div>
            </div>
            <div className={layout.ColumnAlignRight}>
              <Chip
                size="small"
                color="secondary"
                label={
                  subscription.fetchTask.resolved ? (
                    `${subscription.state}`
                  ) : (
                    <CircularProgress size={15} />
                  )
                }
              />
              <IconButton
                size="small"
                onClick={() =>
                  topics.changeSelectedSubscription(subscription.name)
                }
              >
                <NavigateNext />
              </IconButton>
            </div>
          </div>
        </CardContent>
      </StyledTopicCard>
    );
  });
};
