import React, {useEffect} from "react"
import {Subscription} from "../store/subscription";
import {useObserver} from "mobx-react-lite";
import {CardContent, Chip, CircularProgress, IconButton} from "@material-ui/core";
import layout from "../styles/layout.css";
import styles from "../styles/details.css";
import {NavigateNext} from "@material-ui/icons";
import {useStore} from "../store/storeProvider";
import {StyledTopicCard} from "./styledMuiComponents";

export const SubscriptionListElement = ({subscription}: { subscription: Subscription }) => {
    const {topics} = useStore()

    return useObserver(() => {
        useEffect(() => {
            subscription.fetchTask();
        }, [subscription])

        return (
            <StyledTopicCard key={subscription.name}>
                <CardContent>
                    <div className={layout.Row}>
                        <div className={layout.Column}>
                            <div className={styles.DetailsName}>
                                {subscription.name}
                            </div>
                            <div className={styles.DetailsUrl}>
                                Endpoint: <b>{subscription.fetchTask.resolved ? subscription.endpoint :
                                <CircularProgress size={15}/>}</b>
                            </div>
                        </div>
                        <div className={layout.ColumnAlignRight}>
                            <Chip size="small"
                                  color="secondary"
                                  label={subscription.fetchTask.resolved
                                      ? `${subscription.state}`
                                      : <CircularProgress size={15}/>}/>
                            <IconButton size="small" onClick={() => topics.changeSelectedSubscription(subscription.name)}><NavigateNext/></IconButton>
                        </div>
                    </div>
                </CardContent>
            </StyledTopicCard>
        )
    })
}