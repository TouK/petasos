import NavigateNext from "@mui/icons-material/NavigateNext";
import { CardContent, IconButton } from "@mui/material";
import { Observer } from "mobx-react-lite";
import React, { PropsWithChildren, useState } from "react";
import { useStore } from "../store/storeProvider";
import layout from "../styles/layout.css";
import styles from "../styles/layout.css";
import topicBarStyles from "../styles/topic-bar.css";
import { StyledPagination, StyledTopicCard } from "./styledMuiComponents";
import { SubscriptionsCounter } from "./subscriptionsCounter";
import { TopicFrontendUrl } from "./topicFrontendUrl";

const TopicsSublist = ({ topicsList }: { topicsList: string[] }) => {
  const { topics } = useStore();
  const topicsMap = topics.topicsMap;
  const changeSelectedTopic = topics.changeSelectedTopic;
  return (
    <Observer>
      {() => (
        <div style={{ paddingTop: "8px" }}>
          {topicsList.map((topic) => {
            return (
              <StyledTopicCard key={topic}>
                <CardContent>
                  <div className={topicBarStyles.Topic}>
                    <div className={topicBarStyles.TopicColumn}>
                      <div className={topicBarStyles.TopicName}>{topic}</div>
                      <TopicFrontendUrl topic={topic} />
                    </div>
                    <div className={topicBarStyles.TopicColumnRight}>
                      <SubscriptionsCounter topic={topicsMap.get(topic)} />
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => changeSelectedTopic(topic)}
                      >
                        <NavigateNext />
                      </IconButton>
                    </div>
                  </div>
                </CardContent>
              </StyledTopicCard>
            );
          })}
        </div>
      )}
    </Observer>
  );
};

const TopicsPage = ({
  topicsList,
  selectedGroup,
}: {
  topicsList: string[];
  selectedGroup?: string;
}) => (
  <Observer>
    {() => (
      <div className={styles.LayoutBodyMain}>
        {topicsList.length === 0 ? (
          <EmptyTopicsPage selectedGroup={selectedGroup} />
        ) : (
          <FullTopicsPage topicsList={topicsList} />
        )}
      </div>
    )}
  </Observer>
);

const WithHeader = ({ children }: PropsWithChildren<unknown>) => (
  <div className={styles.LayoutBodyContent}>
    <div className={layout.LayerSectionHeader}>Topics</div>
    {children}
  </div>
);

const FullTopicsPage = ({ topicsList }: { topicsList: string[] }) => {
  const [page, setPage] = useState(1);
  const topicsPerPage = 10;

  const pageList = topicsList.slice(
    (page - 1) * topicsPerPage,
    Math.min(topicsList.length, page * topicsPerPage)
  );

  const pageSize = Math.ceil(topicsList.length / topicsPerPage);

  return (
    <Observer>
      {() => (
        <>
          <WithHeader>
            <TopicsSublist topicsList={pageList} />
          </WithHeader>
          <StyledPagination
            count={pageSize}
            page={page}
            onChange={(event, p) => setPage(p)}
          />
        </>
      )}
    </Observer>
  );
};

const EmptyTopicsPage = ({ selectedGroup }: { selectedGroup?: string }) => (
  <Observer>
    {() => (
      <WithHeader>
        <div className={layout.LayoutBodyContentInfo}>
          No topics yet
          {selectedGroup && ` in group ${selectedGroup}`}.
        </div>
      </WithHeader>
    )}
  </Observer>
);

export const TopicList = () => {
  const { groups } = useStore();
  return (
    <Observer>
      {() => (
        <div className={styles.LayoutBodyMain}>
          {groups.selectedGroup ? (
            <TopicsPage
              topicsList={groups.topicsOfSelectedGroup}
              selectedGroup={groups.selectedGroup}
            />
          ) : (
            <TopicsPage topicsList={groups.allTopicsList} />
          )}
        </div>
      )}
    </Observer>
  );
};
