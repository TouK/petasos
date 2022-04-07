import { Button } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Task } from "mobx-task/lib/task";
import React, { PropsWithChildren, useEffect } from "react";
import { LayoutBodyContent } from "./layoutBodyContent";
import { LoadingMask } from "./loadingMask";

type FetchFn = () => Promise<unknown>;

const ReFetchButton = ({
  fetchFn,
}: PropsWithChildren<{ fetchFn: FetchFn }>) => (
  <Button variant="contained" color="primary" onClick={fetchFn}>
    Try again
  </Button>
);

const ErrorView = ({ fetchFn }: PropsWithChildren<{ fetchFn: FetchFn }>) => (
  <LayoutBodyContent>
    <p>Error when fetching data</p>
    <ReFetchButton fetchFn={fetchFn} />
  </LayoutBodyContent>
);

export const EnsureFetched = observer(
  (props: PropsWithChildren<{ task: Task<unknown[], unknown> }>) => {
    const { children, task } = props;

    useEffect(() => {
      task();
    }, [task]);

    if (task.rejected) {
      return <ErrorView fetchFn={task} />;
    }

    return (
      <>
        <LoadingMask open={task.pending} />
        {children}
      </>
    );
  }
);
