import { Container, Stack, useMediaQuery, useTheme } from "@mui/material";
import React, { ComponentType, Fragment, PropsWithChildren, useContext } from "react";
import { Outlet } from "react-router-dom";
import { DialogsType } from "../store/store";
import { AddClonedTopicDialog } from "./addClonedTopicDialog";
import { AddGroupDialog } from "./addGroupDialog";
import { AddTopicDialog } from "./addTopicDialog";
import { ChangeSubscriptionStateDialog } from "./changeSubscriptionStateDialog";
import { DeleteGroupDialog } from "./deleteGroupDialog";
import { DeleteSubscriptionDialog } from "./deleteSubscriptionDialog";
import { DeleteTopicDialog } from "./deleteTopicDialog";
import { DialogPortal } from "./dialogPortal";
import { EditTopicDialog } from "./editTopicDialog";
import { Footer } from "./footer";
import { LayoutColumn } from "./layout";
import { NavigationBar } from "./navigationBar";
import { RetransmitMessageDialog } from "./retransmitMessageDialog";
import { ShouldUseDialogPortals } from "./rootProviders";
import { AddClonedSubscriptionDialog, AddSubscriptionDialog, EditSubscriptionDialog } from "./subscriptionDialog";

const dialogs: Record<keyof DialogsType, ComponentType> = {
    group: () => <AddGroupDialog />,
    deleteGroupDialog: () => <DeleteGroupDialog />,
    topic: () => <AddTopicDialog />,
    addClonedTopic: () => <AddClonedTopicDialog />,
    editTopic: () => <EditTopicDialog />,
    deleteTopicDialog: () => <DeleteTopicDialog />,
    subscription: () => <AddSubscriptionDialog />,
    editSubscription: () => <EditSubscriptionDialog />,
    addClonedSubscription: () => <AddClonedSubscriptionDialog />,
    deleteSubscriptionDialog: () => <DeleteSubscriptionDialog />,
    retransmitMessageDialog: () => <RetransmitMessageDialog />,
    changeSubscriptionStateDialog: () => <ChangeSubscriptionStateDialog />,
};

const Dialogs = () => {
    const shouldUsePortals = useContext(ShouldUseDialogPortals);
    return (
        <Fragment>
            {Object.entries(dialogs).map(([key, View]) =>
                shouldUsePortals ? (
                    <DialogPortal key={key} id={key}>
                        <View />
                    </DialogPortal>
                ) : (
                    <View key={key} />
                ),
            )}
        </Fragment>
    );
};

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
