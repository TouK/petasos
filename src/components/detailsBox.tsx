import React, { PropsWithChildren, ReactNode } from "react";
import styles from "../styles/details.css";

export function DetailsBox({
  header,
  children,
}: PropsWithChildren<{ header: ReactNode }>) {
  return (
    <div className={styles.DetailsBox}>
      <div className={styles.DetailsBoxHeader}>{header}</div>
      {children}
    </div>
  );
}
