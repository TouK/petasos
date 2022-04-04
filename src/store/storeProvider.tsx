import { useLocalStore } from "mobx-react-lite";
import * as React from "react";
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { Store, StoreOptions } from "./store";

const StoreContext = createContext<Store>(null);

export function StoreProvider({
  children,
  options,
}: PropsWithChildren<{ options?: StoreOptions }>) {
  const store = useLocalStore(() => new Store(options));

  useEffect(() => {
    store.setOptions(options);
  }, [options, store]);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};
