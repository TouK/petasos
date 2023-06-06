//TODO: not this way
import { Container, Stack } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
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
import { AddClonedSubscriptionDialog, AddSubscriptionDialog, EditSubscriptionDialog } from "./subscriptionDialog";

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
export const MainLayout = ({ children = <Outlet /> }: PropsWithChildren<unknown>) => {
    return (
        <>
            <Dialogs />
            <Stack spacing={2} paddingY={2} flex={1} justifyContent="space-between" alignItems="center">
                <Container maxWidth="lg">
                    <LayoutColumn alignItems="stretch">
                        <NavigationBar />
                        {children}
                    </LayoutColumn>
                </Container>
                <Footer />
            </Stack>
        </>
    );
};
