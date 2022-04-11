import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import KeyboardDateTimePicker from "@mui/lab/DatePicker";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  Snackbar,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { observer, useObserver } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useCopyClipboard } from "../hooks/useCopyClipboard";
import { SubscriptionInfo } from "../propertiesInfo";
import { useStore } from "../store/storeProvider";
import { Subscription } from "../store/subscription";
import { Topic } from "../store/topic";
import styles from "../styles/details.css";
import layout from "../styles/layout.css";
import { DetailsBox } from "./detailsBox";
import { LoadingButton } from "./loadingButton";
import {
  createRow,
  PropertiesTable,
  PropertiesTableRow,
} from "./propertiesTable";
import {
  DarkTooltip,
  SmallIconButton,
  StyledDialog,
  StyledPaper,
} from "./styledMuiComponents";
import { calendarTheme } from "./theme";

export const SubscriptionDetails = observer(
  (props: { topic: Topic; subscription: Subscription }) => {
    const { dialogs, options } = useStore();
    const { topic, subscription } = props;

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [openStateChangeDialog, setOpenStateChangeDialog] = useState(false);
    const [openRetransmissionDialog, setOpenRetransmissionDialog] =
      useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedDate, handleDateChange] = useState(moment());
    const [isCopied, copy] = useCopyClipboard();

    useEffect(() => {
      const fetchData = async () => {
        await subscription.fetchTask();
        await subscription.fetchMetricsTask();
        await subscription.fetchLastUndeliveredMsgTask();
      };
      fetchData();
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

    const changeSubscriptionState = async () => {
      subscription.state === "ACTIVE"
        ? await subscription.suspendTask()
        : await subscription.activateTask();
      await subscription.fetchTask();
      setOpenStateChangeDialog(false);
    };

    const retransmitMessages = async () => {
      await subscription.retransmitMessagesTask(selectedDate);
      setSnackbarOpen(true);
      setOpenRetransmissionDialog(false);
    };

    const RetransmitMessageDialog = () =>
      useObserver(() => (
        <StyledDialog open={openRetransmissionDialog}>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to retransmit all messages since{" "}
              <b>{selectedDate.format(timeFormat)}</b>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              size="small"
              disabled={!subscription.retransmitMessagesTask.resolved}
              onClick={() => setOpenRetransmissionDialog(false)}
            >
              Cancel
            </Button>
            <LoadingButton
              color="secondary"
              variant="contained"
              size="small"
              onClick={retransmitMessages}
              loading={subscription.retransmitMessagesTask.pending}
              text="Retransmit"
            />
          </DialogActions>
        </StyledDialog>
      ));

    const ChangeSubscriptionStateDialog = () =>
      useObserver(() => (
        <StyledDialog open={openStateChangeDialog}>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to{" "}
              {subscription.state === "ACTIVE" ? "suspend" : "activate"}{" "}
              subscription <b>{subscription.name}</b>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              size="small"
              onClick={() => setOpenStateChangeDialog(false)}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick={changeSubscriptionState}
              autoFocus
              disabled={
                !subscription.activateTask.resolved ||
                !subscription.suspendTask.resolved
              }
            >
              Confirm
            </Button>
          </DialogActions>
        </StyledDialog>
      ));

    return (
      <div>
        <ChangeSubscriptionStateDialog />
        <RetransmitMessageDialog />
        {topic && (
          <>
            <div className={styles.DetailsHeader}>
              <div className={layout.Row}>
                <div className={layout.Column}>
                  <div className={styles.DetailsHeaderSubtitle}>
                    Subscription to topic {topic.name}
                  </div>
                  <div className={styles.DetailsHeaderTitle}>
                    {subscription.name}{" "}
                    <Chip
                      size="small"
                      color="secondary"
                      label={`${subscription.state}`}
                    />
                  </div>
                </div>
                <div className={layout.ColumnAlignRight}>
                  {(subscription.state === "ACTIVE" ||
                    subscription.state === "SUSPENDED") && (
                    <>
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        startIcon={
                          subscription.state === "ACTIVE" ? (
                            <PauseIcon />
                          ) : (
                            <PlayArrowIcon />
                          )
                        }
                        onClick={() => setOpenStateChangeDialog(true)}
                      >
                        {subscription.state === "ACTIVE"
                          ? "Suspend"
                          : "Activate"}
                      </Button>{" "}
                    </>
                  )}
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    startIcon={<EditIcon />}
                    onClick={() =>
                      dialogs.editSubscription.open({
                        topic,
                        subscription,
                      })
                    }
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    startIcon={<FileCopyIcon />}
                    onClick={() =>
                      dialogs.addClonedSubscription.open({
                        topic,
                        subscription,
                      })
                    }
                  >
                    Clone
                  </Button>{" "}
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      dialogs.deleteSubscriptionDialog.open({
                        topic,
                        subscription,
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
            <DetailsBox header="Endpoint">
              <StyledPaper
                style={{
                  padding: "10px",
                  color: "#B4C498",
                }}
              >
                {subscription.endpoint}{" "}
                <DarkTooltip
                  title={isCopied ? "Copied!" : "Copy"}
                  placement="top"
                >
                  <SmallIconButton
                    size="small"
                    color="primary"
                    type="button"
                    onClick={() => copy(subscription.endpoint)}
                  >
                    <FileCopyIcon />
                  </SmallIconButton>
                </DarkTooltip>
              </StyledPaper>
            </DetailsBox>
            <div className={layout.Row}>
              <div className={layout.Column}>
                <DetailsBox header="Properties">
                  <PropertiesTable
                    properties={
                      showAdvanced && options.allowAdvancedFields
                        ? properties.concat(advancedProperties)
                        : properties
                    }
                  />
                  {options.allowAdvancedFields && (
                    <Button
                      size="small"
                      color={"primary"}
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      {showAdvanced ? "Hide advanced" : "Show advanced"}
                    </Button>
                  )}
                </DetailsBox>
                <DetailsBox header="Last undelivered message">
                  {subscription.fetchLastUndeliveredMsgTask.resolved && (
                    <>
                      {subscription.lastUndeliveredMessage ? (
                        <PropertiesTable properties={undeliveredMessage} />
                      ) : (
                        <div className={layout.p}>
                          There was no undelivered message.
                        </div>
                      )}
                    </>
                  )}
                  {subscription.fetchLastUndeliveredMsgTask.pending && (
                    <CircularProgress />
                  )}
                </DetailsBox>
              </div>
              <div className={layout.Column}>
                <DetailsBox header="Metrics">
                  <div className={layout.Row}>
                    <div className={layout.Column}>
                      {subscription.fetchMetricsTask.resolved && (
                        <PropertiesTable properties={metrics} />
                      )}
                      {subscription.fetchMetricsTask.pending && (
                        <CircularProgress />
                      )}
                    </div>
                  </div>
                </DetailsBox>
                <DetailsBox header="Message retransmission">
                  <StyledPaper
                    style={{
                      padding: "10px",
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <ThemeProvider theme={calendarTheme}>
                      <KeyboardDateTimePicker
                        renderInput={(props) => (
                          <TextField label="Start date" {...props} />
                        )}
                        value={selectedDate}
                        onChange={handleDateChange}
                        onError={console.log}
                        disableFuture
                        minDate={moment.unix(subscription.createdAt)}
                        inputFormat="yyyy/MM/DD HH:mm"
                      />
                    </ThemeProvider>
                    <div style={{ marginTop: "10px" }}>
                      <Button
                        color="secondary"
                        variant="contained"
                        size="small"
                        onClick={() => setOpenRetransmissionDialog(true)}
                        autoFocus
                      >
                        Retransmit
                      </Button>
                    </div>
                    <Snackbar
                      open={snackbarOpen}
                      autoHideDuration={6000}
                      onClose={() => setSnackbarOpen(false)}
                    >
                      {subscription.retransmitMessagesTask.resolved ? (
                        <Alert
                          onClose={() => setSnackbarOpen(false)}
                          severity="success"
                        >
                          Messages have been retransmitted successfully
                        </Alert>
                      ) : (
                        <Alert
                          onClose={() => setSnackbarOpen(false)}
                          severity="error"
                        >
                          Error occurred when retransmitting messages
                        </Alert>
                      )}
                    </Snackbar>
                  </StyledPaper>
                </DetailsBox>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);
