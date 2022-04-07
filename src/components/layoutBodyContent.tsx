import React, { PropsWithChildren } from "react";
import styles from "../styles/layout.css";

export function LayoutBodyContent({ children }: PropsWithChildren<unknown>) {
  return (
    <>
      <div className={styles.LayoutBodyContent}>{children}</div>
    </>
  );
}

export function LayoutBodyRow({ children }: PropsWithChildren<unknown>) {
  return (
    <>
      <div className={styles.LayoutBody}>{children}</div>
    </>
  );
}
