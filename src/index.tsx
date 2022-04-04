import { configure } from "mobx";
import * as React from "react";
import { render } from "react-dom";
import { Root } from "./components/root";

configure({
  enforceActions: "observed",
});

function init() {
  const appRoot = document.getElementById("appRoot");
  if (appRoot) {
    render(<Root />, appRoot);
  } else {
    const root = document.createElement("div");
    document.body.appendChild(root);
    render(<Root />, root);
  }
}

init();
