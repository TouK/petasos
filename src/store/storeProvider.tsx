import {useLocalStore} from "mobx-react-lite";
import * as React from "react";
import {createContext, PropsWithChildren, useContext} from "react";
import {Store} from "./store";

const StoreContext = createContext<Store>(null);

export function StoreProvider (props: PropsWithChildren<{}>) {
    const store = useLocalStore(() => new Store());
    return (
        <StoreContext.Provider value={store}>
            {props.children}
        </StoreContext.Provider>
    );
}

export const useStore = () => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error("useStore must be used within a StoreProvider.");
    }
    return store;
};
