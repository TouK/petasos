import {useObserver} from "mobx-react-lite";
import React, {useEffect} from "react"
import {useStore} from "../store/storeProvider"
import {TopicList} from "./topicList";
import {GroupsList} from "./groupsList";
import styles from "../styles/layout.css"
import {Header} from "./header";
import {TopicDetails} from "./topicDetails";
import {AddClonedTopicDialog, AddTopicDialog} from "./addTopicDialog";
import {AddGroupDialog} from "./addGroupDialog";
import {theme} from "./theme";
import {Backdrop, Button, CircularProgress, ThemeProvider} from "@material-ui/core";
import {SubscriptionDetails} from "./subscriptionDetails";
import {
    AddClonedSubscriptionDialog,
    AddSubscriptionDialog,
    EditSubscriptionDialog
} from "./subscriptionDialog";
import {EditTopicDialog} from "./editTopicDialog";
import {NavigationBar} from "./navigationBar";
import {DeleteGroupDialog} from "./deleteGroupDialog";
import {DeleteSubscriptionDialog, DeleteTopicDialog} from "./deleteDialog";

export const MainPanel = () => {
    const {groups, topics} = useStore();

    return useObserver(() => {
        useEffect(() => {
            fetchData();
        }, [])

        const fetchData = async () => {
            await groups.fetchTask();
            await topics.fetchTask();
        }

        return (
            <ThemeProvider theme={theme}>
                <div className={styles.Layout}>
                    <Header/>
                    <Backdrop
                        open={(topics.fetchTask.pending || groups.fetchTask.pending) && !(topics.fetchTask.rejected || groups.fetchTask.rejected)}
                        style={{color: '#fff', zIndex: 1}}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                    <AddTopicDialog/>
                    <AddClonedTopicDialog/>
                    <EditTopicDialog/>
                    <AddGroupDialog/>
                    <AddSubscriptionDialog/>
                    <EditSubscriptionDialog/>
                    <AddClonedSubscriptionDialog/>
                    <DeleteGroupDialog/>
                    {topics.selectedSubscriptionName && <DeleteSubscriptionDialog/>}
                    {topics.selectedTopicName && <DeleteTopicDialog />}
                    <NavigationBar/>
                    <div className={styles.LayoutBody}>

                        {groups.fetchTask.rejected ?
                            <div className={styles.LayoutBodyContent}>
                                <span>Error when fetching data</span>
                                <br/><br/>
                                <Button variant="contained" color="primary" onClick={fetchData}>
                                    Try again
                                </Button>
                            </div>
                            :
                            <>
                                {topics.selectedTopic ?
                                    <div className={styles.LayoutBodyContent}>
                                        {topics.selectedSubscription ? <SubscriptionDetails/> :
                                            <TopicDetails/>
                                        }</div> :
                                    <>
                                        <GroupsList/>
                                        <TopicList/>
                                    </>}
                            </>}
                    </div>
                </div>
            </ThemeProvider>
        )
    })
}