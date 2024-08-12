import { useField } from "formik";
import { TextField } from "formik-mui";
import { TextFieldProps } from "formik-mui/dist/TextField";
import React, { useMemo } from "react";
import { CodeEditor, CodeEditorProps } from "./codeEditor";

function formatJson(value: string): string {
    try {
        return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
        return value;
    }
}

const FieldCodeEditor = ({ name, ...props }: CodeEditorProps & { name: string }) => {
    const [{ value }, , { setValue }] = useField(name);
    return <CodeEditor {...props} value={value} onChange={setValue} />;
};

export function JsonTextField(props: TextFieldProps) {
    const {
        field: { name },
    } = props;

    const inputProps = useMemo(
        () => ({
            inputComponent: (props) => <FieldCodeEditor name={name} {...props} />,
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
