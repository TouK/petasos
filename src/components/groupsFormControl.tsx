import { MenuItem } from "@mui/material";
import { Field, FormikErrors } from "formik";
import { Select } from "formik-mui";
import { FieldAttributes } from "formik/dist/Field";
import { Observer } from "mobx-react-lite";
import React, { PropsWithChildren } from "react";
import { TopicFormikValues } from "../models";
import { Groups } from "../store/groups";
import dialogStyles from "../styles/dialog.css";

type Props = PropsWithChildren<
  {
    errors?: FormikErrors<TopicFormikValues>;
    groups: Groups;
  } & Partial<FieldAttributes<unknown>>
>;

export const GroupsFormControl = ({
  errors,
  groups,
  children,
  ...props
}: Props): JSX.Element => (
  <Observer>
    {() => (
      <div className={dialogStyles.DialogRow}>
        <div className={dialogStyles.DialogColumn}>
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
        </div>
        {children && (
          <div className={dialogStyles.DialogColumn}>{children}</div>
        )}
      </div>
    )}
  </Observer>
);
