import { configure } from "mobx";
import * as React from "react";
import { render } from "react-dom";
import { Root } from "./components/root";

configure({
  enforceActions: "observed",
});

function init() {
  let appRoot = document.getElementById("appRoot");
  if (!appRoot) {
    appRoot = document.createElement("div");
    document.body.appendChild(appRoot);
  }
  render(<Root />, appRoot);
}

init();
