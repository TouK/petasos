import NavigateNext from "@mui/icons-material/NavigateNext";
import { CardContent, IconButton } from "@mui/material";
import { useObserver } from "mobx-react-lite";
import React, { useState } from "react";
import { useStore } from "../store/storeProvider";
import layout from "../styles/layout.css";
import styles from "../styles/layout.css";
import topicBarStyles from "../styles/topic-bar.css";
import { StyledPagination, StyledTopicCard } from "./styledMuiComponents";
import { SubscriptionsCounter } from "./subscriptionsCounter";
import { TopicFrontendUrl } from "./topicFrontendUrl";

export const TopicList = () => {
  const { groups, topics } = useStore();

  const TopicsSublist = ({ topicsList }) =>
    useObserver(() => {
      return (
        <div style={{ paddingTop: "8px" }}>
          {topicsList.map((topic) => (
            <StyledTopicCard key={topic}>
              <CardContent>
                <div className={topicBarStyles.Topic}>
                  <div className={topicBarStyles.TopicColumn}>
                    <div className={topicBarStyles.TopicName}>{topic}</div>
                    <TopicFrontendUrl topic={topic} />
                  </div>
                  <div className={topicBarStyles.TopicColumnRight}>
                    <SubscriptionsCounter topic={topics.topicsMap.get(topic)} />
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => topics.changeSelectedTopic(topic)}
                    >
                      <NavigateNext />
                    </IconButton>
                  </div>
                </div>
              </CardContent>
            </StyledTopicCard>
          ))}
        </div>
      );
    });

  const TopicsPage = ({ topicsList }: { topicsList: string[] }) =>
    useObserver(() => {
      const [page, setPage] = useState(1);
      const topicsPerPage = 10;

      return (
        <div className={styles.LayoutBodyMain}>
          {topicsList.length === 0 ? (
            <div className={styles.LayoutBodyContent}>
              <div className={layout.LayerSectionHeader}>Topics</div>
              <div className={layout.LayoutBodyContentInfo}>
                No topics yet
                {groups.selectedGroup && ` in group ${groups.selectedGroup}`}.
              </div>
            </div>
          ) : (
            <>
              <div className={styles.LayoutBodyContent}>
                <div className={layout.LayerSectionHeader}>Topics</div>
                <TopicsSublist
                  topicsList={topicsList.slice(
                    (page - 1) * topicsPerPage,
                    Math.min(topicsList.length, page * topicsPerPage)
                  )}
                />
              </div>
              <StyledPagination
                count={Math.ceil(topicsList.length / topicsPerPage)}
                page={page}
                onChange={(event, p) => setPage(p)}
              />
            </>
          )}
        </div>
      );
    });

  return useObserver(() => {
    return (
      <div className={styles.LayoutBodyMain}>
        {groups.selectedGroup ? (
          <TopicsPage
            topicsList={topics.getTopicsOfGroup(groups.selectedGroup)}
          />
        ) : (
          <TopicsPage topicsList={groups.allTopicsList} />
        )}
      </div>
    );
  });
};
