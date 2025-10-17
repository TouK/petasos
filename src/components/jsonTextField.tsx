import { useField } from "formik";
import { TextField } from "formik-mui";
import { TextFieldProps } from "formik-mui/dist/TextField";
import React, { forwardRef, useMemo } from "react";
import { CodeEditor, CodeEditorProps } from "./codeEditor";

function formatJson(value: string): string {
    try {
        return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
        return value;
    }
}

type FieldCodeEditorProps = CodeEditorProps & { name: string };
const FieldCodeEditor = forwardRef<HTMLDivElement, FieldCodeEditorProps>(function FieldCodeEditor({ name, ...props }, ref) {
    const [{ value }, , { setValue }] = useField(name);
    return <CodeEditor ref={ref} {...props} value={value} onChange={setValue} />;
});

export function JsonTextField(props: TextFieldProps) {
    const {
        field: { name },
    } = props;

    const inputProps = useMemo(
        () => ({
            // FIXME: props type
            inputComponent: forwardRef<HTMLDivElement, any>(function InputComponent(props, ref) {
                return <FieldCodeEditor ref={ref} name={name} {...props} />;
            }),
        }),
        [name],
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
