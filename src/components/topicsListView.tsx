import { observer } from "mobx-react-lite";
import React, { PropsWithChildren } from "react";
import { useStore } from "../store/storeProvider";
import { EnsureFetched } from "./ensureFetched";
import { GroupsList } from "./groupsList";
import { LayoutBodyRow } from "./layoutBodyContent";
import { TopicList } from "./topicList";

const GroupsView = observer(({ children }: PropsWithChildren<unknown>) => {
  const { groups } = useStore();

  return (
    <LayoutBodyRow>
      <EnsureFetched task={groups.fetchTask}>
        {!groups.isGroupsListHidden && <GroupsList />}
      </EnsureFetched>
      {children}
    </LayoutBodyRow>
  );
});

export const TopicsListView = () => (
  <GroupsView>
    <TopicList />
  </GroupsView>
);
