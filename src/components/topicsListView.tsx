import loadable from "@loadable/component";
import { observer } from "mobx-react-lite";
import React, { PropsWithChildren } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../store/storeProvider";
import { EnsureFetched } from "./ensureFetched";
import { GroupsList } from "./groupsList";
import { LayoutColumn, LayoutRow } from "./layout";
import { Topics } from "./topics";

const GroupsLayout = observer(({ children }: PropsWithChildren<unknown>) => {
  const { groups } = useStore();
  return (
    <EnsureFetched task={groups.fetchTask}>
      <LayoutRow>
        {!groups.isGroupsListHidden && <GroupsList />}
        <LayoutColumn>{children}</LayoutColumn>
      </LayoutRow>
    </EnsureFetched>
  );
});

const TopicsListView = () => {
  const [searchParams] = useSearchParams();
  const group = searchParams.get("group");

  return (
    <GroupsLayout>
      <Topics group={group} />
    </GroupsLayout>
  );
};

export default TopicsListView;
