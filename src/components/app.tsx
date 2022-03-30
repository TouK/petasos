import { useObserver } from "mobx-react-lite";
import * as React from "react";
import { Route, Router, Switch } from "react-router-dom";
import { history } from "../store/store";
import { MainPanel } from "./mainPanel";

export function App() {
  return useObserver(() => (
    <Router history={history}>
      <Switch>
        <Route path="/" component={MainPanel} />
      </Switch>
    </Router>
  ));
}
