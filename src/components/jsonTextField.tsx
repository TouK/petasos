import { TextField } from "formik-mui";
import { TextFieldProps } from "formik-mui/dist/TextField";
import React, { useMemo } from "react";
import { CodeEditor } from "./codeEditor";

function formatJson(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export function JsonTextField(props: TextFieldProps) {
  const {
    field: { name },
    form: { setFieldValue },
  } = props;

  const inputProps = useMemo(
    () => ({
      inputComponent: CodeEditor as any,
      onChange: (code) => setFieldValue(name, code),
    }),
    [name, setFieldValue]
  );

  const inputLabelProps = useMemo(() => ({ shrink: true }), []);

  return (
    <TextField
      {...props}
      InputProps={inputProps}
      InputLabelProps={inputLabelProps}
      inputProps={{
        className: "language-json",
        formatter: formatJson,
      }}
    />
  );
}
