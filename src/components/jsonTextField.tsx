import { TextField } from "formik-mui";
import { TextFieldProps } from "formik-mui/dist/TextField";
import React, { useMemo } from "react";
import { CodeEditor } from "./codeEditor";

export function JsonTextField(props: TextFieldProps) {
  const {
    field: { name },
    form: { setFieldValue },
  } = props;

  const inputProps = useMemo(
    () => ({
      inputComponent: CodeEditor as any,
      onChange: (code) => setFieldValue(name, code),
      className: "language-json",
    }),
    [name, setFieldValue]
  );

  const inputLabelProps = useMemo(() => ({ shrink: true }), []);

  return (
    <TextField
      {...props}
      InputProps={inputProps}
      InputLabelProps={inputLabelProps}
    />
  );
}
