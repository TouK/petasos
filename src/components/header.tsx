import React from "react"
import styles from "../styles/layout.css"

export const Header = () => {
    return (
        <div className={styles.LayoutHeader}>
            <div className={styles.LayoutHeaderCell}>
                <div className={styles.LayoutHeaderTitle}>Manage topics <br/>
                    & subscriptions
                </div>
            </div>
            <div className={styles.LayoutHeaderSubtitle}>
                <p className={styles.LayerHeaderP}>powered by</p>
                <img className={styles.LayoutHeaderImg}
                     src="https://hermes-pubsub.readthedocs.io/en/latest/img/hermes.png"/>
            </div>
        </div>
    )
}
