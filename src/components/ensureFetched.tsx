import { Alert, Button } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Task } from "mobx-task/lib/task";
import React, { PropsWithChildren, useEffect } from "react";
import { ContentBox } from "./contentBox";
import { LoadingMask } from "./loadingMask";

type FetchFn = () => Promise<unknown>;

const ReFetchButton = ({ fetchFn }: PropsWithChildren<{ fetchFn: FetchFn }>) => (
    <Button color="inherit" size="small" onClick={fetchFn}>
        Try again
    </Button>
);

const ErrorView = ({ fetchFn }: PropsWithChildren<{ fetchFn: FetchFn }>) => (
    <ContentBox>
        <Alert variant="filled" severity="error" action={<ReFetchButton fetchFn={fetchFn} />}>
            Error when fetching data.
        </Alert>
    </ContentBox>
);

export const EnsureFetched = observer((props: PropsWithChildren<{ task: Task<unknown[], unknown> }>) => {
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
});
