import {
  Backdrop,
  Button,
  CircularProgress,
  ThemeProvider,
} from "@mui/material";
import { useObserver } from "mobx-react-lite";
import React, { useCallback, useEffect } from "react";
import { useStore } from "../store/storeProvider";
import styles from "../styles/layout.css";
import { AddGroupDialog } from "./addGroupDialog";
import { AddClonedTopicDialog, AddTopicDialog } from "./addTopicDialog";
import { DeleteSubscriptionDialog, DeleteTopicDialog } from "./deleteDialog";
import { DeleteGroupDialog } from "./deleteGroupDialog";
import { EditTopicDialog } from "./editTopicDialog";
import { GroupsList } from "./groupsList";
import { Header } from "./header";
import { NavigationBar } from "./navigationBar";
import { SubscriptionDetails } from "./subscriptionDetails";
import {
  AddClonedSubscriptionDialog,
  AddSubscriptionDialog,
  EditSubscriptionDialog,
} from "./subscriptionDialog";
import { theme } from "./theme";
import { TopicDetails } from "./topicDetails";
import { TopicList } from "./topicList";

export const MainPanel = () => {
  const { groups, topics } = useStore();

  const fetchData = useCallback(async () => {
    await groups.fetchTask();
    await topics.fetchTask();
  }, [groups, topics]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useObserver(() => {
    return (
      <ThemeProvider theme={theme}>
        <div className={styles.Layout}>
          <Header />
          <Backdrop
            open={
              (topics.fetchTask.pending || groups.fetchTask.pending) &&
              !(topics.fetchTask.rejected || groups.fetchTask.rejected)
            }
            style={{ color: "#fff", zIndex: 1 }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <AddTopicDialog />
          <AddClonedTopicDialog />
          <EditTopicDialog />
          <AddGroupDialog />
          <AddSubscriptionDialog />
          <EditSubscriptionDialog />
          <AddClonedSubscriptionDialog />
          <DeleteGroupDialog />
          {topics.selectedSubscriptionName && <DeleteSubscriptionDialog />}
          {topics.selectedTopicName && <DeleteTopicDialog />}
          <NavigationBar />
          <div className={styles.LayoutBody}>
            {groups.fetchTask.rejected ? (
              <div className={styles.LayoutBodyContent}>
                <span>Error when fetching data</span>
                <br />
                <br />
                <Button variant="contained" color="primary" onClick={fetchData}>
                  Try again
                </Button>
              </div>
            ) : (
              <>
                {topics.selectedTopic ? (
                  <div className={styles.LayoutBodyContent}>
                    {topics.selectedSubscription ? (
                      <SubscriptionDetails />
                    ) : (
                      <TopicDetails />
                    )}
                  </div>
                ) : (
                  <>
                    <GroupsList />
                    <TopicList />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </ThemeProvider>
    );
  });
};
