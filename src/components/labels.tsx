import { HelpOutline } from "@mui/icons-material";
import { Box, Link, Tooltip } from "@mui/material";
import React, { PropsWithChildren, ReactNode } from "react";

function LabelWithHint({ children, hint }: PropsWithChildren<{ hint: ReactNode }>) {
    return (
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
            {children}
            <Tooltip title={hint} placement="top">
                <HelpOutline fontSize="small" color="disabled" sx={{ marginLeft: 0.5 }} />
            </Tooltip>
        </Box>
    );
}

export default {
    dialogs: {
        addGroup: "Add new group",
        addTopic: "Add new topic",
        editTopic: "Edit topic",
        addSubscription: (topic = "") => `Add new subscription to topic ${topic}`.trim(),
        editSubscription: (topic = "") => `Edit subscription to topic ${topic}`.trim(),
    },
    topic: {
        name: "Topic name",
        description: "Topic description",
        contentType: {
            label: "Message format:",
            avro: {
                label: (
                    <LabelWithHint
                        hint={
                            "You will need to provide Avro schema for your data. The data will be binary encoded using Avro serialization framework."
                        }
                    >
                        Avro schema
                    </LabelWithHint>
                ),
            },
            json: {
                label: (
                    <LabelWithHint
                        hint={
                            <>
                                Your data will be transmitted as plain text (no binary encoding). You will still be able to manipulate JSON
                                objects using{" "}
                                <Link
                                    href="https://nussknacker.io/documentation/docs/scenarios_authoring/Spel/#dynamic-navigation"
                                    target="_blank"
                                >
                                    dynamic navigation
                                </Link>
                                .
                            </>
                        }
                    >
                        Any data
                    </LabelWithHint>
                ),
            },
        },
    },
};
