import TopicIcon from "@mui/icons-material/Topic";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  Paper,
  Stack,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { Topic } from "../store/topic";
import { EmptyListPlaceholder } from "./emptyListPlaceholder";
import { SubscriptionsCounter } from "./subscriptionsCounter";

const TopicsList = observer(({ names }: { names: string[] }) => {
  const { topics } = useStore();
  return (
    <Box component={Paper}>
      <List>
        {names.map((name) => (
          <TopicListElement key={name} topic={topics.topicsMap.get(name)} />
        ))}
      </List>
    </Box>
  );
});

const TopicListElement = observer(({ topic }: { topic: Topic }) => {
  const navigate = useNavigate();

  useEffect(() => {
    topic.fetchTask();
  }, [topic]);

  return (
    <ListItemButton onClick={() => navigate(topic.name)}>
      <ListItemIcon>
        <TopicIcon />
      </ListItemIcon>
      <ListItemText primary={topic.displayName} secondary={topic.description} />
      <SubscriptionsCounter topic={topic} />
    </ListItemButton>
  );
});

const PagedTopicsList = ({
  names,
  pageSize,
}: {
  names: string[];
  pageSize?: number;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageList = useMemo(
    () =>
      names.slice(
        (currentPage - 1) * pageSize,
        Math.min(names.length, currentPage * pageSize)
      ),
    [names, currentPage, pageSize]
  );

  const pagesCount = useMemo(
    () => Math.ceil(names.length / pageSize),
    [names.length, pageSize]
  );

  return (
    <Stack spacing={1}>
      <TopicsList names={pageSize ? pageList : names} />
      {pageSize && (
        <Stack direction="row" justifyContent="center">
          <Pagination
            count={pagesCount}
            page={currentPage}
            onChange={(event, p) => setCurrentPage(p)}
          />
        </Stack>
      )}
    </Stack>
  );
};

export const Topics = observer(({ group }: { group?: string }) => {
  const { groups } = useStore();
  const names = group ? groups.getTopicsForGroup(group) : groups.allTopicsList;
  return (
    <>
      {names.length ? (
        <PagedTopicsList names={names} />
      ) : (
        <EmptyListPlaceholder>
          {group ? (
            <>
              No topics yet in group <strong>{group}</strong>
            </>
          ) : (
            <>No topics yet</>
          )}
        </EmptyListPlaceholder>
      )}
    </>
  );
});
