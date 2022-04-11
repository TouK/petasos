import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Button, CircularProgress } from "@mui/material";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { TopicInfo } from "../propertiesInfo";
import { useStore } from "../store/storeProvider";
import { Topic } from "../store/topic";
import styles from "../styles/details.css";
import layout from "../styles/layout.css";
import { DetailsBox } from "./detailsBox";
import {
  createRow,
  PropertiesTable,
  PropertiesTableRow,
} from "./propertiesTable";
import { StyledPaper } from "./styledMuiComponents";
import { SubscriptionListElement } from "./subscriptionListElement";
import { TopicFrontendUrl } from "./topicFrontendUrl";

const MessagePreview = observer(({ topic }: { topic: Topic }) => {
  useEffect(() => {
    topic.fetchMessagePreviewTask();
    const interval = setInterval(() => topic.fetchMessagePreviewTask(), 10000);
    return () => clearInterval(interval);
  }, [topic]);

  return (
    <DetailsBox header="Message preview">
      {topic.fetchMessagePreviewTask.pending && <CircularProgress />}
      {topic.messagePreview?.length > 0 ? (
        <StyledPaper style={{ padding: "10px" }}>
          <div>
            {topic.filteredMessagePreview.map((msg, i) => (
              <pre key={i}>{msg}</pre>
            ))}
          </div>
        </StyledPaper>
      ) : (
        <div className={layout.p}>There are no messages available.</div>
      )}
    </DetailsBox>
  );
});

export const TopicDetails = observer(({ topic }: { topic: Topic }) => {
  const { dialogs, options } = useStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const timeFormat = "dddd, MMMM Do, YYYY h:mm:ss A";

  const properties: PropertiesTableRow[] = [
    createRow("Description", topic.description),
    createRow("Creation date", moment.unix(topic.createdAt).format(timeFormat)),
    createRow(
      "Modification date",
      moment.unix(topic.modifiedAt).format(timeFormat)
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
    <>
      <div className={styles.DetailsHeader}>
        <div className={layout.Row}>
          <div className={layout.Column}>
            <div className={styles.DetailsHeaderSubtitle}>topic</div>
            <div className={styles.DetailsHeaderTitle}>{topic.displayName}</div>
            <TopicFrontendUrl topic={topic.name} />
          </div>
          <div className={layout.ColumnAlignRight}>
            <Button
              variant={"contained"}
              color={"primary"}
              startIcon={<EditIcon />}
              onClick={() => dialogs.editTopic.open({ topic })}
            >
              Edit
            </Button>{" "}
            <Button
              variant={"contained"}
              color={"primary"}
              startIcon={<FileCopyIcon />}
              onClick={() => dialogs.addClonedTopic.open({ topic })}
            >
              Clone
            </Button>{" "}
            <Button
              variant={"contained"}
              color={"primary"}
              startIcon={<DeleteIcon />}
              onClick={() => dialogs.deleteTopicDialog.open({ topic })}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>

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
          <DetailsBox
            header={
              <>
                Subscriptions{" "}
                <Button
                  color="secondary"
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={() => dialogs.subscription.open({ topic })}
                >
                  Add subscription
                </Button>
              </>
            }
          >
            {topic.subscriptionsMap.size > 0 ? (
              Array.from(topic.subscriptionsMap).map(([name, sub]) => (
                <SubscriptionListElement key={name} subscription={sub} />
              ))
            ) : (
              <div className={layout.p}>No subscriptions yet</div>
            )}
          </DetailsBox>
        </div>
        <div className={layout.Column}>
          <DetailsBox header="Message schema">
            <StyledPaper style={{ padding: "10px" }}>
              {topic.contentType !== "AVRO" ? (
                <div className={layout.p}>Not an AVRO schema</div>
              ) : (
                <pre>{topic.schemaWithoutMetadata}</pre>
              )}
            </StyledPaper>
          </DetailsBox>
          <MessagePreview topic={topic} />
        </div>
      </div>
    </>
  );
});
