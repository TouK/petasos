import { configure } from "mobx";
import * as React from "react";
import { render } from "react-dom";
import { Root } from "./components/root";

const root = document.createElement("div");
document.body.appendChild(root);

const domContainer = document.querySelector("#appRoot");

configure({
  enforceActions: "observed",
});

function init() {
  const appRoot = document.getElementById("appRoot");
  if (appRoot) {
    render(<Root />, domContainer);
  } else {
    render(<Root />, root);
  }
}

init();
