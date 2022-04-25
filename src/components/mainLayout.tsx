//TODO: not this way
import { Box, Container, ThemeProvider } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { AddClonedTopicDialog } from "./addClonedTopicDialog";
import { AddGroupDialog } from "./addGroupDialog";
import { AddTopicDialog } from "./addTopicDialog";
import { ChangeSubscriptionStateDialog } from "./changeSubscriptionStateDialog";
import { DeleteGroupDialog } from "./deleteGroupDialog";
import { DeleteSubscriptionDialog } from "./deleteSubscriptionDialog";
import { DeleteTopicDialog } from "./deleteTopicDialog";
import { EditTopicDialog } from "./editTopicDialog";
import { Header } from "./header";
import { LayoutColumn } from "./layout";
import { NavigationBar } from "./navigationBar";
import { RetransmitMessageDialog } from "./retransmitMessageDialog";
import {
  AddClonedSubscriptionDialog,
  AddSubscriptionDialog,
  EditSubscriptionDialog,
} from "./subscriptionDialog";
import { theme } from "./theme";

const Dialogs = () => (
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
    <RetransmitMessageDialog />
    <ChangeSubscriptionStateDialog />
  </>
);
export const MainLayout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
        }}
      >
        <Dialogs />
        <Header />

        <Container maxWidth="lg">
          <LayoutColumn alignItems="stretch">
            <NavigationBar />
            {children}
          </LayoutColumn>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
