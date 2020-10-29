import React from "react"
import {useStore} from "../store/storeProvider";
import {useObserver} from "mobx-react-lite";
import {Breadcrumbs, Link, Typography} from "@material-ui/core";
import layout from "../styles/layout.css"
import {StyledButton} from "./styledMuiComponents";
import AddIcon from "@material-ui/icons/Add";

export const NavigationBar = () => {
    const {topics, groups, dialogs} = useStore()

    return useObserver(() => {
        return (
            <div className={layout.LayoutBody}>
                <div className={layout.LayoutNavigationBreadcrumbs}>
                    <Breadcrumbs aria-label="breadcrumb">
                        {topics.selectedTopic &&
                        <Link component="button" color="textSecondary" onClick={() => topics.changeSelectedTopic(null)}>Groups and topics</Link>}
                        {topics.selectedSubscription &&
                        <Link component="button" color="textSecondary" onClick={() => topics.changeSelectedSubscription(null)}>
                            {topics.selectedTopic.name}</Link>}
                        {topics.selectedSubscription &&
                        <Typography variant="body2" color="textPrimary">{topics.selectedSubscription.name}</Typography>}
                        {topics.selectedTopic && !topics.selectedSubscription &&
                        <Typography variant="body2" color="textPrimary">{topics.selectedTopic.name}</Typography>}
                        {!topics.selectedTopic && <Typography variant="body2" color="textPrimary">Groups and topics</Typography>}
                    </Breadcrumbs>
                </div>
                <div className={layout.LayoutNavigationButton}>
                    <StyledButton color="secondary" variant="contained"
                                  onClick={() => dialogs.topic.setOpen(true)}
                                  startIcon={<AddIcon/>}
                                  disabled={!groups.fetchTask.resolved}>
                        Add topic
                    </StyledButton>
                </div>
            </div>
        )
    })
}