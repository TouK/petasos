import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { SubscriptionInfo } from "../propertiesInfo";
import { useStore } from "../store/storeProvider";
import { Subscription } from "../store/subscription";
import { Topic } from "../store/topic";
import { DetailsBox } from "./detailsBox";
import { LayoutRow } from "./layout";
import {
  createRow,
  PropertiesTable,
  PropertiesTableRow,
} from "./propertiesTable";
import { DetailsHeader, DetailsProperties } from "./topicDetails";

export const SubscriptionDetails = observer(
  (props: { topic: Topic; subscription: Subscription }) => {
    const { topic, subscription } = props;

    useEffect(() => {
      subscription.fetchTask();
    }, [subscription]);

    return (
      <>
        {topic && (
          <SubscriptionDetailsHeader
            topic={topic}
            subscription={subscription}
          />
        )}
        <Divider />

        <Box mx={2} my={4}>
          <Stack spacing={4} direction="row">
            <Stack spacing={4} flex={1}>
              <SubscriptionProperties subscription={subscription} />
              <Divider flexItem />
              <LastUndeliveredMessage subscription={subscription} />
            </Stack>
            <Divider flexItem orientation="vertical" />
            <Stack spacing={4} flex={1}>
              <SubscriptionMetrics subscription={subscription} />
              <Divider flexItem />
              <MessageRetransmission subscription={subscription} />
            </Stack>
          </Stack>
        </Box>
      </>
    );
  }
);

const SubscriptionDetailsHeader = observer(
  (props: { topic: Topic; subscription: Subscription }) => {
    const { dialogs } = useStore();
    const { topic, subscription } = props;

    useEffect(() => {
      subscription.fetchTask();
    }, [subscription]);

    return (
      <DetailsHeader
        actions={[
          ["ACTIVE", "SUSPENDED"].includes(subscription.state) && {
            color: subscription.state === "ACTIVE" ? "warning" : "success",
            Icon:
              subscription.state === "ACTIVE" ? (
                <PauseIcon />
              ) : (
                <PlayArrowIcon />
              ),
            action: () =>
              dialogs.changeSubscriptionStateDialog.open({ subscription }),
            label: subscription.state === "ACTIVE" ? "Suspend" : "Activate",
          },
          {
            Icon: <EditIcon />,
            action: () =>
              dialogs.editSubscription.open({
                topic,
                subscription,
              }),
            label: "Edit",
          },
          {
            Icon: <FileCopyIcon />,
            action: () =>
              dialogs.addClonedSubscription.open({
                topic,
                subscription,
              }),
            label: "Clone",
          },
          {
            Icon: <DeleteIcon />,
            action: () =>
              dialogs.deleteSubscriptionDialog.open({
                topic,
                subscription,
              }),
            label: "Remove",
          },
        ]}
        label={subscription.name}
        textToCopy={subscription.endpoint}
        description={subscription.description}
      />
    );
  }
);

const MessageRetransmission = observer(
  (props: { subscription: Subscription }) => {
    const { subscription } = props;
    const { dialogs } = useStore();

    const [selectedDate, handleDateChange] = useState(moment());

    return (
      <DetailsBox header="Messages retransmission">
        <LayoutRow spacing={1} alignItems="stretch">
          <DateTimePicker
            renderInput={(props) => <TextField label="Start date" {...props} />}
            value={selectedDate}
            onChange={handleDateChange}
            onError={console.log}
            disableFuture
            minDate={moment.unix(subscription.createdAt)}
            label="Start date"
            inputFormat="yyyy/MM/DD HH:mm"
          />
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            onClick={() => {
              dialogs.retransmitMessageDialog.open({
                subscription,
                selectedDate,
              });
            }}
            autoFocus
          >
            Retransmit
          </Button>
        </LayoutRow>
      </DetailsBox>
    );
  }
);

const SubscriptionMetrics = observer(
  (props: { subscription: Subscription }) => {
    const { subscription } = props;

    useEffect(() => {
      subscription.fetchMetricsTask();
    }, [subscription]);

    const metrics: PropertiesTableRow[] = subscription.metrics
      ? [
          subscription.metrics.rate !== "unavailable" &&
            createRow("Delivery rate", `${subscription.metrics.rate}`),
          createRow("Delivered messages", `${subscription.metrics.delivered}`),
          createRow("Discarded messages", `${subscription.metrics.discarded}`),
          subscription.metrics.lag !== "-1" &&
            createRow(
              "Lag",
              `${subscription.metrics.lag}`,
              SubscriptionInfo.metrics.lag
            ),
          subscription.metrics.codes2xx !== "unavailable" &&
            createRow("Codes 2xx", `${subscription.metrics.codes2xx}`),
          subscription.metrics.codes4xx !== "unavailable" &&
            createRow("Codes 4xx", `${subscription.metrics.codes4xx}`),
          subscription.metrics.codes5xx !== "unavailable" &&
            createRow("Codes 5xx", `${subscription.metrics.codes5xx}`),
          subscription.metrics.timeouts !== "unavailable" &&
            createRow("Network timeouts", `${subscription.metrics.timeouts}`),
          subscription.metrics.otherErrors !== "unavailable" &&
            createRow(
              "Other network errors",
              `${subscription.metrics.otherErrors}`
            ),
        ]
      : [];

    return (
      <DetailsProperties
        header="Metrics"
        properties={metrics}
        actions={[
          {
            Icon: <RefreshIcon />,
            action: () => subscription.fetchMetricsTask(),
            label: "Refresh",
            pending: subscription.fetchMetricsTask.pending,
          },
        ]}
      />
    );
  }
);

const LastUndeliveredMessage = observer(
  (props: { subscription: Subscription }) => {
    const { subscription } = props;

    useEffect(() => {
      subscription.fetchLastUndeliveredMsgTask();
    }, [subscription]);

    const timeFormat = "dddd, MMMM Do, YYYY h:mm:ss A";

    const undeliveredMessage: PropertiesTableRow[] =
      subscription.lastUndeliveredMessage
        ? [
            createRow(
              "Date",
              moment(subscription.lastUndeliveredMessage.timestamp).format(
                timeFormat
              )
            ),
            createRow("Reason", subscription.lastUndeliveredMessage.reason),
            createRow("Message", subscription.lastUndeliveredMessage.message),
          ]
        : [];

    return (
      <DetailsBox
        header="Last undelivered message"
        actions={[
          {
            Icon: <RefreshIcon />,
            action: () => subscription.fetchLastUndeliveredMsgTask(),
            label: "Refresh",
            pending: subscription.fetchLastUndeliveredMsgTask.pending,
          },
        ]}
      >
        {subscription.lastUndeliveredMessage ? (
          <PropertiesTable properties={undeliveredMessage} />
        ) : (
          <Typography variant="body2" color="text.disabled">
            There was no undelivered message.
          </Typography>
        )}
      </DetailsBox>
    );
  }
);

const SubscriptionProperties = observer(
  (props: { subscription: Subscription }) => {
    const { subscription } = props;

    useEffect(() => {
      subscription.fetchTask();
    }, [subscription]);

    const timeFormat = "dddd, MMMM Do, YYYY h:mm:ss A";

    const properties: PropertiesTableRow[] = [
      createRow("Description", subscription.description),
      createRow(
        "Creation date",
        moment.unix(subscription.createdAt).format(timeFormat)
      ),
      createRow(
        "Modification date",
        moment.unix(subscription.modifiedAt).format(timeFormat)
      ),
    ];

    const advancedProperties: PropertiesTableRow[] = [
      createRow("Mode", subscription.mode, SubscriptionInfo.mode),
      createRow(
        "Rate limit",
        `${subscription.subscriptionPolicy.rate}`,
        SubscriptionInfo.subscriptionPolicy.rate
      ),
      createRow(
        "Sending delay",
        `${subscription.subscriptionPolicy.sendingDelay} milliseconds`,
        SubscriptionInfo.subscriptionPolicy.sendingDelay
      ),
      createRow(
        "Message TTL",
        `${subscription.subscriptionPolicy.messageTtl} seconds`,
        SubscriptionInfo.subscriptionPolicy.messageTtl
      ),
      createRow("Message delivery tracking", subscription.trackingMode),
      createRow(
        "Retry on 4xx status",
        subscription.subscriptionPolicy.retryClientErrors ? "yes" : "no",
        SubscriptionInfo.subscriptionPolicy.retryClientErrors
      ),
      createRow(
        "Retry backoff",
        `${subscription.subscriptionPolicy.messageBackoff} milliseconds`,
        SubscriptionInfo.subscriptionPolicy.messageBackoff
      ),
      createRow(
        "Retry backoff multiplier",
        `${subscription.subscriptionPolicy.backoffMultiplier}`,
        SubscriptionInfo.subscriptionPolicy.backoffMultiplier
      ),
      subscription.subscriptionPolicy.backoffMultiplier > 1 &&
        createRow(
          "Retry backoff max interval",
          `${subscription.subscriptionPolicy.backoffMaxIntervalInSec} seconds`,
          SubscriptionInfo.subscriptionPolicy.backoffMaxIntervalInSec
        ),
    ];

    return (
      <DetailsProperties
        properties={properties}
        advancedProperties={advancedProperties}
      />
    );
  }
);
