import * as React from "react";
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { MainLayout } from "./mainLayout";
import { RootView } from "./rootView";
import { SubscriptionView } from "./subscriptionView";
import { TopicDetailsView } from "./topicDetailsView";
import { TopicsListView } from "./topicsListView";
import { TopicView } from "./topicView";

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

export function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<RootView />}>
            <Route index element={<TopicsListView />} />
            <Route path=":topic" element={<TopicView />}>
              <Route index element={<TopicDetailsView />} />
              <Route path=":subscription" element={<SubscriptionView />} />
            </Route>
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
