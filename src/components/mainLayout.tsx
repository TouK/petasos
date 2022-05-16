//TODO: not this way
import { Box, Container, Divider, Stack, ThemeProvider } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { AddClonedTopicDialog } from "./addClonedTopicDialog";
import { AddGroupDialog } from "./addGroupDialog";
import { AddTopicDialog } from "./addTopicDialog";
import { ChangeSubscriptionStateDialog } from "./changeSubscriptionStateDialog";
import { DeleteGroupDialog } from "./deleteGroupDialog";
import { DeleteSubscriptionDialog } from "./deleteSubscriptionDialog";
import { DeleteTopicDialog } from "./deleteTopicDialog";
import { EditTopicDialog } from "./editTopicDialog";
import { Footer } from "./footer";
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
        bgcolor="background.default"
        color="text.primary"
        minHeight="100vh"
        display="flex"
      >
        <Dialogs />
        <Stack
          spacing={2}
          paddingTop={2}
          paddingBottom={1}
          flex={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Container maxWidth="lg">
            <LayoutColumn alignItems="stretch">
              <NavigationBar />
              {children}
            </LayoutColumn>
          </Container>
          <Footer />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};
