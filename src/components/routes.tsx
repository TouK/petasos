import loadable from "@loadable/component";
import { BugReport } from "@mui/icons-material";
import { Box, CircularProgress, Fab } from "@mui/material";
import * as React from "react";
import { RouteObject } from "react-router-dom";
import { localStorageToken } from "../api";
import { MainLayout } from "./mainLayout";
import { RootProviders, RootProvidersProps } from "./rootProviders";
import { RootView } from "./rootView";

const Loading = () => (
    <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
    </Box>
);

const RootElement = (props: RootProvidersProps) => (
    <RootProviders {...props}>
        <MainLayout>
            <RootView />
        </MainLayout>
    </RootProviders>
);

const TopicsListView = loadable(() => import("./topicsListView"), { fallback: <Loading /> });
const TopicView = loadable(() => import("./topicView"), { fallback: <Loading /> });
const TopicDetailsView = loadable(() => import("./topicDetailsView"), { fallback: <Loading /> });
const SubscriptionView = loadable(() => import("./subscriptionView"), { fallback: <Loading /> });

export function createRoutes(props: Partial<RootProvidersProps> = {}): RouteObject[] {
    const { basepath, tokenGetter = localStorageToken, open } = props;
    return [
        {
            path: "/",
            element: (
                <>
                    <Fab
                        color="warning"
                        sx={{
                            position: "fixed",
                            bottom: (t) => t.spacing(2),
                            right: (t) => t.spacing(2),
                        }}
                        onClick={async () => {
                            const accessToken = await tokenGetter();
                            const href = `http://localhost:7890?accessToken=${accessToken}`;
                            window.location.href = href;
                        }}
                    >
                        <BugReport />
                    </Fab>
                    <RootElement basepath={basepath} tokenGetter={tokenGetter} open={open} />
                </>
            ),
            children: [
                {
                    index: true,
                    element: <TopicsListView />,
                },
                {
                    path: ":topic",
                    element: <TopicView />,
                    children: [
                        {
                            index: true,
                            element: <TopicDetailsView />,
                        },
                        {
                            path: ":subscription",
                            element: <SubscriptionView />,
                        },
                    ],
                },
            ],
        },
    ];
}
