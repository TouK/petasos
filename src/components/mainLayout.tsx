//TODO: not this way
import { Container, Stack, useMediaQuery, useTheme } from "@mui/material";
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

export const MAIN_CLASSNAME = "petasos-main";

export const MainLayout = ({ children = <Outlet /> }: PropsWithChildren<unknown>) => {
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.up("md"));

    return (
        <>
            <Dialogs />
            <Container className={MAIN_CLASSNAME} maxWidth="xl" disableGutters={!md} sx={{ flex: 1, display: "flex", minHeight: "100%" }}>
                <Stack
                    sx={{
                        flex: 1,
                        paddingY: 2,
                        paddingX: 2,
                        justifyContent: "space-between",
                        alignItems: "stretch",
                        p: (theme) => (theme.breakpoints.up("md") ? 2 : 0),
                    }}
                    spacing={2}
                >
                    <LayoutColumn alignItems="stretch">
                        <NavigationBar />
                        {children}
                    </LayoutColumn>
                    <Footer />
                </Stack>
            </Container>
        </>
    );
};
