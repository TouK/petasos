import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    FileCopy as FileCopyIcon,
    Refresh as RefreshIcon,
    Settings as SettingsIcon,
} from "@mui/icons-material";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { JSONTree } from "react-json-tree";
import { MessagePreviewModel } from "../models";
import { TopicInfo } from "../propertiesInfo";
import { useStore } from "../store/storeProvider";
import { Topic } from "../store/topic";
import { DetailsBox } from "./detailsBox";
import { ActionButtonProps, DetailsHeaderAction } from "./detailsBoxHeaderAction";
import { ActionsRow } from "./layout";
import { createRow, PropertiesTable, PropertiesTableRow } from "./propertiesTable";
import { SubscriptionListElement } from "./subscriptionListElement";
import { TextWithCopy } from "./textWithCopy";
import { Timestamp } from "./timestamp";

const MessagesPreview = observer(({ topic }: { topic: Topic }) => {
    useEffect(() => {
        topic.fetchMessagePreviewTask();
        const interval = setInterval(() => topic.fetchMessagePreviewTask(), 10000);
        return () => clearInterval(interval);
    }, [topic]);

    return (
        <DetailsBox
            header="Last messages preview"
            actions={[
                {
                    Icon: <RefreshIcon />,
                    action: () => topic.fetchMessagePreviewTask(),
                    label: "Refresh",
                    pending: topic.fetchMessagePreviewTask.pending,
                },
            ]}
        >
            {topic.messagePreview?.length > 0 ? (
                topic.messagePreview.map(({ content, timestamp }: MessagePreviewModel) => (
                    <Box key={`${timestamp}${content}`} position="relative">
                        <JsonTree jsonText={content} />
                        <Timestamp timestamp={timestamp} />
                    </Box>
                ))
            ) : (
                <Typography variant="body2" color="text.disabled">
                    There are no messages available
                </Typography>
            )}
        </DetailsBox>
    );
});

export function DetailsHeaderActions({ actions }: { actions: ActionButtonProps[] }) {
    const filteredActions = actions.filter(Boolean);
    return (
        <ActionsRow>
            {filteredActions.map((action) => (
                <DetailsHeaderAction key={action.label} {...action} />
            ))}
        </ActionsRow>
    );
}

const TopicDetailsHeader = observer(({ topic }: { topic: Topic }) => {
    const { dialogOpen } = useStore();
    return (
        <DetailsHeader
            actions={[
                {
                    Icon: <EditIcon />,
                    action: () => dialogOpen("editTopic", { topic }),
                    label: "Edit",
                },
                {
                    Icon: <FileCopyIcon />,
                    action: () => dialogOpen("addClonedTopic", { topic }),
                    label: "Clone",
                },
                {
                    Icon: <DeleteIcon />,
                    action: () => dialogOpen("deleteTopicDialog", { topic }),
                    label: "Remove",
                },
            ]}
            label={topic.displayName}
            textToCopy={topic.reqUrl}
            description={topic.description}
        />
    );
});

export function DetailsHeader({
    label,
    textToCopy,
    description,
    actions,
}: {
    actions: ActionButtonProps[];
    label: string;
    textToCopy?: string;
    description?: string;
}) {
    return (
        <Stack
            direction="row-reverse"
            alignItems="flex-start"
            justifyContent="flex-start"
            flexWrap="wrap-reverse"
            rowGap={2}
            spacing={2}
            m={2}
        >
            <DetailsHeaderActions actions={actions} />
            <Stack flex={1}>
                <Stack direction="row-reverse" alignItems="baseline" flexWrap="wrap-reverse" spacing={1}>
                    {textToCopy && <TextWithCopy flex={10} variant="caption" color="text.disabled" value={textToCopy} />}
                    <Typography flex={1} variant="h4">
                        {label}
                    </Typography>
                </Stack>
                {description && <Typography>{description}</Typography>}
            </Stack>
        </Stack>
    );
}

const TopicProperties = observer(({ topic }: { topic: Topic }) => {
    const timeFormat = "dddd, MMMM Do, YYYY h:mm:ss A";

    const properties: PropertiesTableRow[] = [
        createRow("Creation date", topic.createdAt && moment.unix(topic.createdAt).format(timeFormat)),
        createRow("Modification date", topic.modifiedAt && moment.unix(topic.modifiedAt).format(timeFormat)),
    ];

    const advancedProperties: PropertiesTableRow[] = [
        createRow("Acknowledgement", topic.ack, TopicInfo.ack),
        createRow("Retention time", `${topic.retentionTime.duration} days`, TopicInfo.retentionTime.duration),
        topic.trackingHidden ? null : createRow("Tracking enabled", `${topic.trackingEnabled}`),
        createRow("Max message size", `${topic.maxMessageSize}`),
    ];

    return <DetailsProperties properties={properties} advancedProperties={advancedProperties} />;
});

export const DetailsProperties = observer(
    ({
        header,
        actions = [],
        properties,
        advancedProperties,
    }: {
        header?: string;
        actions?: ActionButtonProps[];
        properties: PropertiesTableRow[];
        advancedProperties?: PropertiesTableRow[];
    }) => {
        const { options } = useStore();
        const [showAdvanced, setShowAdvanced] = useState(false);

        return (
            <DetailsBox
                header={header || "Properties"}
                actions={[
                    ...actions,
                    advancedProperties?.length &&
                        options.allowAdvancedFields && {
                            Icon: <SettingsIcon />,
                            action: () => setShowAdvanced(!showAdvanced),
                            label: showAdvanced ? "Hide advanced" : "Show advanced",
                        },
                ]}
            >
                <PropertiesTable
                    properties={properties}
                    advancedProperties={showAdvanced && options.allowAdvancedFields ? advancedProperties : null}
                />
            </DetailsBox>
        );
    },
);

const TopicSubscriptionsList = observer(({ topic }: { topic: Topic }) => {
    const { dialogOpen } = useStore();
    return (
        <DetailsBox
            header="Subscriptions"
            actions={[
                {
                    color: "primary",
                    Icon: <AddIcon />,
                    action: () => dialogOpen("subscription", { topic }),
                    label: "Add subscription",
                },
            ]}
        >
            {topic.subscriptionsMap.size > 0 ? (
                Array.from(topic.subscriptionsMap).map(([name, sub]) => <SubscriptionListElement key={name} subscription={sub} />)
            ) : (
                <Typography variant="body2" color="text.disabled">
                    No subscriptions yet
                </Typography>
            )}
        </DetailsBox>
    );
});

export function JsonTree({ override, jsonText, rootLabel }: { override?: JSX.Element; jsonText: string; rootLabel?: string }) {
    const { palette } = useTheme();
    const data = useMemo(() => {
        try {
            return JSON.parse(jsonText);
        } catch ({ message }) {
            return message;
        }
    }, [jsonText]);

    return (
        <Typography component={Box} variant="body2" sx={{ fontFamily: "'Roboto Mono', monospace" }}>
            {override ||
                (typeof data === "string" ? (
                    <Typography color="error">{data}</Typography>
                ) : (
                    <JSONTree
                        data={data}
                        shouldExpandNode={(keyPath, data, level) => level <= 3}
                        theme={{
                            base00: "transparent",
                            base03: "transparent",
                            base07: "inherit",
                            base08: palette.text.disabled,
                            base09: palette.warning.main,
                            base0B: palette.success.main,
                            base0D: palette.info.main,
                        }}
                        invertTheme={false}
                        hideRoot={!rootLabel}
                        labelRenderer={([key, ...path]) => `${path.length > 0 ? key : rootLabel || key}:`}
                    />
                ))}
        </Typography>
    );
}

const TopicSchema = observer(({ topic }: { topic: Topic }) => {
    return (
        <DetailsBox header="Message schema">
            <JsonTree jsonText={topic.schemaPrettified} override={topic.contentType !== "AVRO" && <span>Not an AVRO schema</span>} />
        </DetailsBox>
    );
});

export const TopicDetails = observer(({ topic }: { topic: Topic }) => {
    return (
        <>
            <TopicDetailsHeader topic={topic} />
            <Divider />
            <Box mx={2} my={4}>
                <Stack spacing={4} direction="row">
                    <Stack spacing={4} flex={6}>
                        <TopicSubscriptionsList topic={topic} />
                        <Divider flexItem />
                        <MessagesPreview topic={topic} />
                    </Stack>
                    <Divider flexItem orientation="vertical" />
                    <Stack spacing={4} flex={5}>
                        <TopicProperties topic={topic} />
                        <Divider flexItem />
                        <TopicSchema topic={topic} />
                    </Stack>
                </Stack>
            </Box>
        </>
    );
});
