import NavigateNext from "@mui/icons-material/NavigateNext";
import { CardContent, IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { PropsWithChildren, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import layout from "../styles/layout.css";
import styles from "../styles/layout.css";
import topicBarStyles from "../styles/topic-bar.css";
import { LayoutBodyContent } from "./layoutBodyContent";
import { StyledPagination, StyledTopicCard } from "./styledMuiComponents";
import { SubscriptionsCounter } from "./subscriptionsCounter";
import { TopicFrontendUrl } from "./topicFrontendUrl";

const TopicsSublist = observer(({ topicsList }: { topicsList: string[] }) => {
  const { topics } = useStore();
  const navigate = useNavigate();
  return (
    <div style={{ paddingTop: "8px" }}>
      {topicsList.map((topic) => (
        <StyledTopicCard key={topic}>
          <CardContent>
            <div className={topicBarStyles.Topic}>
              <div className={topicBarStyles.TopicColumn}>
                <div className={topicBarStyles.TopicName}>
                  {topics.getTopicDisplayName(topic)}
                </div>
                <TopicFrontendUrl topic={topic} />
              </div>
              <div className={topicBarStyles.TopicColumnRight}>
                <SubscriptionsCounter topic={topics.topicsMap.get(topic)} />
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => navigate(topic)}
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

const TopicsPage = observer(
  ({ topicsList, groupName }: { topicsList: string[]; groupName?: string }) => (
    <div className={styles.LayoutBodyMain}>
      {topicsList.length === 0 ? (
        <EmptyTopicsPage groupName={groupName} />
      ) : (
        <FullTopicsPage topicsList={topicsList} />
      )}
    </div>
  )
);

const WithHeader = ({ children }: PropsWithChildren<unknown>) => (
  <LayoutBodyContent>
    <div className={layout.LayerSectionHeader}>Topics</div>
    {children}
  </LayoutBodyContent>
);

const FullTopicsPage = observer(({ topicsList }: { topicsList: string[] }) => {
  const [page, setPage] = useState(1);
  const topicsPerPage = 10;

  const pageList = topicsList.slice(
    (page - 1) * topicsPerPage,
    Math.min(topicsList.length, page * topicsPerPage)
  );

  const pageSize = Math.ceil(topicsList.length / topicsPerPage);

  return (
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
  );
});

const EmptyTopicsPage = observer(({ groupName }: { groupName?: string }) => (
  <WithHeader>
    <div className={layout.LayoutBodyContentInfo}>
      No topics yet
      {groupName && ` in group ${groupName}`}.
    </div>
  </WithHeader>
));

export const TopicList = observer(() => {
  const { groups } = useStore();
  const [searchParams] = useSearchParams();

  const currentGroup = searchParams.get("group");

  return (
    <div className={styles.LayoutBodyMain}>
      {currentGroup ? (
        <TopicsPage
          topicsList={groups.getTopicsForGroup(currentGroup)}
          groupName={currentGroup}
        />
      ) : (
        <TopicsPage topicsList={groups.allTopicsList} />
      )}
    </div>
  );
});
