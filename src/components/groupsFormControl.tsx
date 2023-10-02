import { MenuItem, Stack } from "@mui/material";
import { Field, FormikErrors, useField } from "formik";
import { Select } from "formik-mui";
import { FieldAttributes } from "formik/dist/Field";
import { observer } from "mobx-react-lite";
import React, { ReactNode, useEffect } from "react";
import { TopicFormikValues } from "../models";
import { useStore } from "../store/storeProvider";

type Props = Partial<FieldAttributes<unknown>> & {
    errors?: FormikErrors<TopicFormikValues>;
    addButton?: ReactNode;
};

export const GroupsFormControl = observer(({ errors, addButton, ...props }: Props): JSX.Element => {
    const store = useStore();
    const { dialogs, groups } = store;

    const [, , { setValue }] = useField("group");
    const { result, resolved, reset } = dialogs.group.open;
    useEffect(() => {
        if (resolved && result) {
            setValue(result);
            reset();
        }
    }, [reset, resolved, result, setValue]);

    return (
        <Stack direction="row" spacing={1} alignItems="stretch">
            <Field
                component={Select}
                formControl={{ fullWidth: true }}
                formHelperText={{ children: errors?.group }}
                required
                name="group"
                label="Group"
                labelId="group-select-label"
                {...props}
            >
                {groups.names.map((groupName) => (
                    <MenuItem value={groupName} key={groupName}>
                        {groupName}
                    </MenuItem>
                ))}
            </Field>
            {addButton}
        </Stack>
    );
});
