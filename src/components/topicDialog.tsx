import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio } from "@mui/material";
import { Field, FormikErrors } from "formik";
import { CheckboxWithLabel, RadioGroup, TextField } from "formik-mui";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import { TopicFormikValues } from "../models";
import { Dialog } from "../store/dialog";
import { useStore } from "../store/storeProvider";
import { Topic } from "../store/topic";
import { DialogTemplate } from "./dialogTemplate";
import { JsonTextField } from "./jsonTextField";
import { GroupsFormControl } from "./groupsFormControl";
import { validateTopicForm } from "./validateTopicForm";

export const TopicDialog = observer(
    ({ initialValues, dialog }: { initialValues: () => TopicFormikValues; dialog: Dialog<{ topic: Topic }> }) => {
        const store = useStore();
        const { dialogs, groups, topics } = store;

        const taskOnSubmit = (values) => Topic.create(values, store);

        const navigate = useNavigate();

        const onSubmitSuccess = async ({ group, topic }: TopicFormikValues): Promise<void> => {
            await groups.fetchTask();
            await topics.fetchTask();
            const topicName = Topic.joinName(group, topic);
            navigate(`/${topicName}`);
        };

        const basicFields = (errors: FormikErrors<TopicFormikValues>): JSX.Element[] => [
            !groups.areGroupsHidden && (
                <GroupsFormControl
                    key="group"
                    errors={errors}
                    addButton={
                        groups.isGroupAddAllowed && (
                            <Box display="flex" alignItems="stretch">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ whiteSpace: "nowrap" }}
                                    onClick={() => dialogs.group.open()}
                                >
                                    Create new group
                                </Button>
                            </Box>
                        )
                    }
                />
            ),
            <Field autoFocus required component={TextField} label="Topic name" name="topic" key="topic" fullWidth />,
            <Field required component={TextField} label="Topic description" name="description" key="description" fullWidth />,
            <Field
                component={JsonTextField}
                label="Avro schema"
                name="schema"
                key="schema"
                id="schema"
                fullWidth
                variant="outlined"
                multiline
                rows={15}
            />,
        ];

        const advancedFields = (): JSX.Element[] => [
            <FormControl key="advancedValues.acknowledgement">
                <FormLabel>Acknowledgement</FormLabel>
                <Field component={RadioGroup} row name={"advancedValues.acknowledgement"}>
                    <FormControlLabel value="LEADER" control={<Radio />} label="LEADER" />
                    <FormControlLabel value="ALL" control={<Radio />} label="ALL" />
                </Field>
            </FormControl>,
            <Field
                component={CheckboxWithLabel}
                Label={{ label: "Tracking enabled" }}
                name="advancedValues.trackingEnabled"
                key="advancedValues.trackingEnabled"
                type="checkbox"
            />,
            <Field
                component={TextField}
                label="Max message size (bytes)"
                name="advancedValues.maxMessageSize"
                key="advancedValues.maxMessageSize"
                style={{ width: "100%" }}
            />,
            <Field
                component={TextField}
                label="Retention time (days)"
                name="advancedValues.retentionTime"
                key="advancedValues.retentionTime"
                style={{ width: "100%" }}
            />,
        ];

        return (
            <DialogTemplate<TopicFormikValues>
                advancedFields={advancedFields}
                basicFields={basicFields}
                dialog={dialog}
                dialogTitle={"Add new topic"}
                initialValues={initialValues()}
                submitButtonText={"Add topic"}
                onSubmitSuccess={onSubmitSuccess}
                taskOnSubmit={taskOnSubmit}
                validateFunc={validateTopicForm}
            />
        );
    },
);
