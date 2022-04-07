import { ThemeProvider } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import styles from "../styles/layout.css";
import { AddClonedTopicDialog } from "./addClonedTopicDialog";
import { AddGroupDialog } from "./addGroupDialog";
import { AddTopicDialog } from "./addTopicDialog";
import { DeleteGroupDialog } from "./deleteGroupDialog";
import { DeleteSubscriptionDialog } from "./deleteSubscriptionDialog";
import { DeleteTopicDialog } from "./deleteTopicDialog";
import { EditTopicDialog } from "./editTopicDialog";
import { EnsureFetched } from "./ensureFetched";
import { Header } from "./header";
import { NavigationBar } from "./navigationBar";
import {
  AddClonedSubscriptionDialog,
  AddSubscriptionDialog,
  EditSubscriptionDialog,
} from "./subscriptionDialog";
import { theme } from "./theme";

///TODO: not this way
const Dialogs = () => {
  return (
    <>
      <AddGroupDialog />
      <DeleteGroupDialog />

      <AddTopicDialog />
      <AddClonedTopicDialog />
      <EditTopicDialog />
      <DeleteTopicDialog />

      <AddSubscriptionDialog />
      <EditSubscriptionDialog />
      <AddClonedSubscriptionDialog />
      <DeleteSubscriptionDialog />
    </>
  );
};

const MainLayout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <ThemeProvider theme={theme}>
      <Dialogs />

      <div className={styles.Layout}>
        <Header />
        <NavigationBar />

        {children}
      </div>
    </ThemeProvider>
  );
};

export const RootView = () => {
  const { topics } = useStore();
  return (
    <MainLayout>
      <EnsureFetched task={topics.fetchTask}>
        <Outlet />
      </EnsureFetched>
    </MainLayout>
  );
};
