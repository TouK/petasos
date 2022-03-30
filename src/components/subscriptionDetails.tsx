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
import { useObserver } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useCopyClipboard } from "../hooks/useCopyClipboard";
import { SubscriptionInfo } from "../propertiesInfo";
import { useStore } from "../store/storeProvider";
import styles from "../styles/details.css";
import layout from "../styles/layout.css";
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

export const SubscriptionDetails = () => {
  const { topics, dialogs } = useStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openStateChangeDialog, setOpenStateChangeDialog] = useState(false);
  const [openRetransmissionDialog, setOpenRetransmissionDialog] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedDate, handleDateChange] = useState(moment());
  const [isCopied, copy] = useCopyClipboard();

  useEffect(() => {
    const fetchData = async () => {
      await topics.selectedSubscription.fetchTask();
      await topics.selectedSubscription.fetchMetricsTask();
      await topics.selectedSubscription.fetchLastUndeliveredMsgTask();
    };
    fetchData();
  }, [topics.selectedSubscription]);

  return useObserver(() => {
    const timeFormat = "dddd, MMMM Do, YYYY h:mm:ss A";

    const properties: PropertiesTableRow[] = [
      createRow("Description", topics.selectedSubscription.description),
      createRow(
        "Creation date",
        moment.unix(topics.selectedSubscription.createdAt).format(timeFormat)
      ),
      createRow(
        "Modification date",
        moment.unix(topics.selectedSubscription.modifiedAt).format(timeFormat)
      ),
    ];

    const advancedProperties: PropertiesTableRow[] = [
      createRow(
        "Mode",
        topics.selectedSubscription.mode,
        SubscriptionInfo.mode
      ),
      createRow(
        "Rate limit",
        `${topics.selectedSubscription.subscriptionPolicy.rate}`,
        SubscriptionInfo.subscriptionPolicy.rate
      ),
      createRow(
        "Sending delay",
        `${topics.selectedSubscription.subscriptionPolicy.sendingDelay} milliseconds`,
        SubscriptionInfo.subscriptionPolicy.sendingDelay
      ),
      createRow(
        "Message TTL",
        `${topics.selectedSubscription.subscriptionPolicy.messageTtl} seconds`,
        SubscriptionInfo.subscriptionPolicy.messageTtl
      ),
      createRow(
        "Message delivery tracking",
        topics.selectedSubscription.trackingMode
      ),
      createRow(
        "Retry on 4xx status",
        topics.selectedSubscription.subscriptionPolicy.retryClientErrors
          ? "yes"
          : "no",
        SubscriptionInfo.subscriptionPolicy.retryClientErrors
      ),
      createRow(
        "Retry backoff",
        `${topics.selectedSubscription.subscriptionPolicy.messageBackoff} milliseconds`,
        SubscriptionInfo.subscriptionPolicy.messageBackoff
      ),
      createRow(
        "Retry backoff multiplier",
        `${topics.selectedSubscription.subscriptionPolicy.backoffMultiplier}`,
        SubscriptionInfo.subscriptionPolicy.backoffMultiplier
      ),
      topics.selectedSubscription.subscriptionPolicy.backoffMultiplier > 1 &&
        createRow(
          "Retry backoff max interval",
          `${topics.selectedSubscription.subscriptionPolicy.backoffMaxIntervalInSec} seconds`,
          SubscriptionInfo.subscriptionPolicy.backoffMaxIntervalInSec
        ),
    ];

    const metrics: PropertiesTableRow[] = topics.selectedSubscription.metrics
      ? [
          topics.selectedSubscription.metrics.rate !== "unavailable" &&
            createRow(
              "Delivery rate",
              `${topics.selectedSubscription.metrics.rate}`
            ),
          createRow(
            "Delivered messages",
            `${topics.selectedSubscription.metrics.delivered}`
          ),
          createRow(
            "Discarded messages",
            `${topics.selectedSubscription.metrics.discarded}`
          ),
          topics.selectedSubscription.metrics.lag !== "-1" &&
            createRow(
              "Lag",
              `${topics.selectedSubscription.metrics.lag}`,
              SubscriptionInfo.metrics.lag
            ),
          topics.selectedSubscription.metrics.codes2xx !== "unavailable" &&
            createRow(
              "Codes 2xx",
              `${topics.selectedSubscription.metrics.codes2xx}`
            ),
          topics.selectedSubscription.metrics.codes4xx !== "unavailable" &&
            createRow(
              "Codes 4xx",
              `${topics.selectedSubscription.metrics.codes4xx}`
            ),
          topics.selectedSubscription.metrics.codes5xx !== "unavailable" &&
            createRow(
              "Codes 5xx",
              `${topics.selectedSubscription.metrics.codes5xx}`
            ),
          topics.selectedSubscription.metrics.timeouts !== "unavailable" &&
            createRow(
              "Network timeouts",
              `${topics.selectedSubscription.metrics.timeouts}`
            ),
          topics.selectedSubscription.metrics.otherErrors !== "unavailable" &&
            createRow(
              "Other network errors",
              `${topics.selectedSubscription.metrics.otherErrors}`
            ),
        ]
      : [];

    const undeliveredMessage: PropertiesTableRow[] = topics.selectedSubscription
      .lastUndeliveredMessage
      ? [
          createRow(
            "Date",
            moment(
              topics.selectedSubscription.lastUndeliveredMessage.timestamp
            ).format(timeFormat)
          ),
          createRow(
            "Reason",
            topics.selectedSubscription.lastUndeliveredMessage.reason
          ),
          createRow(
            "Message",
            topics.selectedSubscription.lastUndeliveredMessage.message
          ),
        ]
      : [];

    const changeSubscriptionState = async () => {
      topics.selectedSubscription.state === "ACTIVE"
        ? await topics.selectedSubscription.suspendTask()
        : await topics.selectedSubscription.activateTask();
      await topics.selectedSubscription.fetchTask();
      setOpenStateChangeDialog(false);
    };

    const retransmitMessages = async () => {
      await topics.selectedSubscription.retransmitMessagesTask(selectedDate);
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
              disabled={
                !topics.selectedSubscription.retransmitMessagesTask.resolved
              }
              onClick={() => setOpenRetransmissionDialog(false)}
            >
              Cancel
            </Button>
            <LoadingButton
              color="secondary"
              variant="contained"
              size="small"
              onClick={retransmitMessages}
              loading={
                topics.selectedSubscription.retransmitMessagesTask.pending
              }
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
              {topics.selectedSubscription.state === "ACTIVE"
                ? "suspend"
                : "activate"}{" "}
              subscription <b>{topics.selectedSubscriptionName}</b>?
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
              disabled={
                !topics.selectedSubscription.activateTask.resolved ||
                !topics.selectedSubscription.suspendTask.resolved
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
        {topics.selectedTopic && (
          <>
            <div className={styles.DetailsHeader}>
              <div className={layout.Row}>
                <div className={layout.Column}>
                  <div className={styles.DetailsHeaderSubtitle}>
                    Subscription to topic {topics.selectedTopic.name}
                  </div>
                  <div className={styles.DetailsHeaderTitle}>
                    {topics.selectedSubscription.name}{" "}
                    <Chip
                      size="small"
                      color="secondary"
                      label={`${topics.selectedSubscription.state}`}
                    />
                  </div>
                </div>
                <div className={layout.ColumnAlignRight}>
                  {(topics.selectedSubscription.state === "ACTIVE" ||
                    topics.selectedSubscription.state === "SUSPENDED") && (
                    <>
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        startIcon={
                          topics.selectedSubscription.state === "ACTIVE" ? (
                            <PauseIcon />
                          ) : (
                            <PlayArrowIcon />
                          )
                        }
                        onClick={() => setOpenStateChangeDialog(true)}
                      >
                        {topics.selectedSubscription.state === "ACTIVE"
                          ? "Suspend"
                          : "Activate"}
                      </Button>{" "}
                    </>
                  )}
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    startIcon={<EditIcon />}
                    onClick={() => dialogs.editSubscription.setOpen(true)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    startIcon={<FileCopyIcon />}
                    onClick={() => dialogs.addClonedSubscription.setOpen(true)}
                  >
                    Clone
                  </Button>{" "}
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      dialogs.deleteSubscriptionDialog.setOpen(true)
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.DetailsBox}>
              <div className={styles.DetailsBoxHeader}>Endpoint</div>
              <StyledPaper
                style={{
                  padding: "10px",
                  color: "#B4C498",
                }}
              >
                {topics.selectedSubscription.endpoint}{" "}
                <DarkTooltip
                  title={isCopied ? "Copied!" : "Copy"}
                  placement="top"
                >
                  <SmallIconButton
                    size="small"
                    color="primary"
                    type="button"
                    onClick={() => copy(topics.selectedSubscription.endpoint)}
                  >
                    <FileCopyIcon />
                  </SmallIconButton>
                </DarkTooltip>
              </StyledPaper>
            </div>
            <div className={layout.Row}>
              <div className={layout.Column}>
                <div className={styles.DetailsBox}>
                  <div className={styles.DetailsBoxHeader}>Properties</div>
                  <PropertiesTable
                    properties={
                      showAdvanced
                        ? properties.concat(advancedProperties)
                        : properties
                    }
                  />
                  <Button
                    size="small"
                    color={"primary"}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? "Hide advanced" : "Show advanced"}
                  </Button>
                </div>
                <div className={styles.DetailsBox}>
                  <div className={styles.DetailsBoxHeader}>
                    Last undelivered message
                  </div>
                  {topics.selectedSubscription.fetchLastUndeliveredMsgTask
                    .resolved && (
                    <>
                      {topics.selectedSubscription.lastUndeliveredMessage ? (
                        <PropertiesTable properties={undeliveredMessage} />
                      ) : (
                        <div className={layout.p}>
                          There was no undelivered message.
                        </div>
                      )}
                    </>
                  )}
                  {topics.selectedSubscription.fetchLastUndeliveredMsgTask
                    .pending && <CircularProgress />}
                </div>
              </div>
              <div className={layout.Column}>
                <div className={styles.DetailsBox}>
                  <div className={styles.DetailsBoxHeader}>Metrics</div>
                  <div className={layout.Row}>
                    <div className={layout.Column}>
                      {topics.selectedSubscription.fetchMetricsTask
                        .resolved && <PropertiesTable properties={metrics} />}
                      {topics.selectedSubscription.fetchMetricsTask.pending && (
                        <CircularProgress />
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.DetailsBox}>
                  <div className={styles.DetailsBoxHeader}>
                    Message retransmission
                  </div>
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
                        minDate={moment.unix(
                          topics.selectedSubscription.createdAt
                        )}
                        inputFormat="yyyy/MM/DD HH:mm"
                      />
                    </ThemeProvider>
                    <div style={{ marginTop: "10px" }}>
                      <Button
                        color="secondary"
                        variant="contained"
                        size="small"
                        onClick={() => setOpenRetransmissionDialog(true)}
                      >
                        Retransmit
                      </Button>
                    </div>
                    <Snackbar
                      open={snackbarOpen}
                      autoHideDuration={6000}
                      onClose={() => setSnackbarOpen(false)}
                    >
                      {topics.selectedSubscription.retransmitMessagesTask
                        .resolved ? (
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
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  });
};
