import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type { ButtonProps } from "@mui/material/Button/Button";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { ReactNode, useEffect, useState } from "react";
import { JSONTree } from "react-json-tree";
import { MessagePreviewModel } from "../models";
import { TopicInfo } from "../propertiesInfo";
import { withoutMetadata } from "../store/metadata";
import { useStore } from "../store/storeProvider";
import { Topic } from "../store/topic";
import { DetailsBox } from "./detailsBox";
import { ActionsRow } from "./layout";
import {
  createRow,
  PropertiesTable,
  PropertiesTableRow,
} from "./propertiesTable";
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
        topic.messagePreview.map(({ content }: MessagePreviewModel) => (
          <Stack key={content} direction="row" alignItems="baseline">
            <JsonTree jsonText={withoutMetadata(content)} />
            <Timestamp message={content} />
          </Stack>
        ))
      ) : (
        <Typography variant="body2" color="text.disabled">
          There are no messages available
        </Typography>
      )}
    </DetailsBox>
  );
});

export interface ActionButtonProps
  extends Omit<ButtonProps, "onClick" | "children" | "startIcon"> {
  Icon: ReactNode;
  action: () => void;
  label: string;
  pending?: boolean;
}

export function DetailsHeaderActions(props: { actions: ActionButtonProps[] }) {
  return (
    <ActionsRow>
      {props.actions
        .filter(Boolean)
        .map(({ label, action, Icon, pending = null, ...props }) =>
          pending === null ? (
            <Button
              key={label}
              variant="outlined"
              color="inherit"
              startIcon={Icon}
              onClick={action}
              {...props}
            >
              {label}
            </Button>
          ) : (
            <LoadingButton
              key={label}
              variant="outlined"
              color="inherit"
              startIcon={Icon}
              onClick={action}
              loading={pending}
              loadingPosition="start"
              {...props}
            >
              {label}
            </LoadingButton>
          )
        )}
    </ActionsRow>
  );
}

const TopicDetailsHeader = observer(({ topic }: { topic: Topic }) => {
  const { dialogs } = useStore();
  return (
    <DetailsHeader
      actions={[
        {
          Icon: <EditIcon />,
          action: () => dialogs.editTopic.open({ topic }),
          label: "Edit",
        },
        {
          Icon: <FileCopyIcon />,
          action: () => dialogs.addClonedTopic.open({ topic }),
          label: "Clone",
        },
        {
          Icon: <DeleteIcon />,
          action: () => dialogs.deleteTopicDialog.open({ topic }),
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
        <Stack
          direction="row-reverse"
          alignItems="baseline"
          flexWrap="wrap-reverse"
          spacing={1}
        >
          {textToCopy && (
            <TextWithCopy
              flex={10}
              variant="caption"
              color="text.disabled"
              value={textToCopy}
            />
          )}
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
    createRow(
      "Creation date",
      topic.createdAt && moment.unix(topic.createdAt).format(timeFormat)
    ),
    createRow(
      "Modification date",
      topic.modifiedAt && moment.unix(topic.modifiedAt).format(timeFormat)
    ),
  ];

  const advancedProperties: PropertiesTableRow[] = [
    createRow("Acknowledgement", topic.ack, TopicInfo.ack),
    createRow(
      "Retention time",
      `${topic.retentionTime.duration} days`,
      TopicInfo.retentionTime.duration
    ),
    createRow("Tracking enabled", `${topic.trackingEnabled}`),
    createRow("Max message size", `${topic.maxMessageSize}`),
  ];

  return (
    <DetailsProperties
      properties={properties}
      advancedProperties={advancedProperties}
    />
  );
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
          advancedProperties={
            showAdvanced && options.allowAdvancedFields
              ? advancedProperties
              : null
          }
        />
      </DetailsBox>
    );
  }
);

const TopicSubscriptionsList = observer(({ topic }: { topic: Topic }) => {
  const { dialogs } = useStore();
  return (
    <DetailsBox
      header="Subscriptions"
      actions={[
        {
          color: "secondary",
          Icon: <AddIcon />,
          action: () => dialogs.subscription.open({ topic }),
          label: "Add subscription",
        },
      ]}
    >
      {topic.subscriptionsMap.size > 0 ? (
        Array.from(topic.subscriptionsMap).map(([name, sub]) => (
          <SubscriptionListElement key={name} subscription={sub} />
        ))
      ) : (
        <Typography variant="body2" color="text.disabled">
          No subscriptions yet
        </Typography>
      )}
    </DetailsBox>
  );
});

export function JsonTree({
  override,
  jsonText,
  rootLabel,
}: {
  override?: JSX.Element;
  jsonText: string;
  rootLabel?: string;
}) {
  const { palette } = useTheme();
  return (
    <Typography
      component={Box}
      variant="body2"
      sx={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      {override || (
        <JSONTree
          data={JSON.parse(jsonText) || {}}
          shouldExpandNode={(keyPath, data, level) => level <= 3}
          theme={{
            base00: "transparent",
            base03: "transparent",
            base07: "inherit",
            base08: palette.text.disabled,
            base09: palette.success.light,
            base0B: palette.secondary.main,
            base0D: palette.primary[palette.mode === "dark" ? "light" : "dark"],
          }}
          invertTheme={false}
          hideRoot={!rootLabel}
          labelRenderer={([key, ...path]) =>
            `${path.length > 0 ? key : rootLabel || key}:`
          }
        />
      )}
    </Typography>
  );
}

const TopicSchema = observer(({ topic }: { topic: Topic }) => {
  return (
    <DetailsBox header="Message schema">
      <JsonTree
        jsonText={topic.schemaPrettified}
        override={
          topic.contentType !== "AVRO" && <span>Not an AVRO schema</span>
        }
      />
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
