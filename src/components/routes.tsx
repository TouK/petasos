import loadable from "@loadable/component";
import { Box, CircularProgress } from "@mui/material";
import * as React from "react";
import { Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { MainLayout } from "./mainLayout";
import { RootProviders } from "./rootProviders";
import { RootView } from "./rootView";

function RouteTester({ path }: { path?: string }) {
    const params = useParams();
    const loc = useLocation();
    return (
        <div>
            <h2>matched {path}</h2>
            <div>{JSON.stringify(params)}</div>
            <div>{JSON.stringify(loc)}</div>
            <Outlet />
        </div>
    );
}

function NoMatch() {
    return (
        <div>
            <h1>no match</h1>
            <RouteTester />
        </div>
    );
}

const Loading = () => (
    <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
    </Box>
);

const opts = {
    fallback: <Loading />,
};

const TopicsListView = loadable(() => import("./topicsListView"), opts);
const SubscriptionView = loadable(() => import("./subscriptionView"), opts);
const TopicDetailsView = loadable(() => import("./topicDetailsView"), opts);
const TopicView = loadable(() => import("./topicView"), opts);

export const RootRoutes = () => (
    <Routes>
        <Route
            path="/"
            element={
                <RootProviders>
                    <MainLayout />
                </RootProviders>
            }
        >
            <Route path="/" element={<RootView />}>
                <Route index element={<TopicsListView />} />
                <Route path=":topic" element={<TopicView />}>
                    <Route index element={<TopicDetailsView />} />
                    <Route path=":subscription" element={<SubscriptionView />} />
                </Route>
            </Route>
            <Route path="*" element={<NoMatch />} />
        </Route>
    </Routes>
);
