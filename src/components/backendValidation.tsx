import { Alert } from "@mui/lab";
import { Slide } from "@mui/material";
import React from "react";

export function BackendValidation({ text }: { text?: string }): JSX.Element {
    return (
        <Slide in={!!text} unmountOnExit mountOnEnter direction="up">
            <Alert variant="outlined" severity="error">
                {text}
            </Alert>
        </Slide>
    );
}
