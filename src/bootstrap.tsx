import { configure } from "mobx";
import * as React from "react";
import { createRoot } from "react-dom/client";
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
    const root = createRoot(appRoot);
    root.render(<Root />);
}

init();
