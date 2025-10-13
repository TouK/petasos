import { styled, useForkRef } from "@mui/material";
import { CodeJar, Position } from "codejar";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";

hljs.registerLanguage("json", json);

const CodeBox = styled("div")(({ theme: t }) => ({
    "&": {
        fontFamily: "'Roboto Mono', monospace",
        padding: 0,
        margin: 0,
    },
    "& .hljs-attr": {
        color: t.palette.info.main,
    },
    "& .hljs-string": {
        color: t.palette.success.main,
    },
    "& .hljs-number": {
        color: t.palette.warning.main,
    },
    "& .hljs-keyword": {
        color: t.palette.success.light,
    },
    "& .hljs-punctuation": {
        color: t.palette.text.disabled,
    },
}));

export type CodeEditorProps = {
    className?: string;
    value: string;
    onChange: (code: string) => void;
    rows: number | string;
    disabled?: boolean;
    autoFocus?: boolean;
    formatter?: (code: string) => string;
};

export const CodeEditor = forwardRef<HTMLDivElement, CodeEditorProps>(function CodeEditor(props, forwardedRef) {
    const { value, onChange, rows, disabled, autoFocus, formatter, ...passProps } = props;

    const editorRef = useRef<HTMLDivElement>(null);
    const ref = useForkRef(forwardedRef, editorRef);

    const jarRef = useRef<CodeJar>(null);
    const positionRef = useRef<Position>(null);
    const [code, setCode] = useState<string>(null);

    //init CodeJar
    useEffect(() => {
        const jar = CodeJar(editorRef.current, hljs.highlightElement, {
            catchTab: false,
            tab: " ".repeat(2),
        });
        jar.onUpdate((code) => {
            positionRef.current = jar.save();
            setCode(code);
        });
        if (autoFocus) {
            editorRef.current.focus();
        }
        jarRef.current = jar;
        if (disabled) {
            editorRef.current.contentEditable = "false";
        }
        return () => jar.destroy();
    }, [autoFocus, disabled]);

    const update = useCallback((value: string) => {
        jarRef.current?.updateCode(value);
        if (positionRef.current) {
            jarRef.current?.restore(positionRef.current);
        }
    }, []);

    //update value from outside
    useEffect(() => {
        update(value);
    }, [update, value]);

    //call change callback
    useEffect(() => {
        const isCodeChanged = code !== null && code !== value;
        if (!disabled && isCodeChanged) {
            onChange(code);
        }
    }, [disabled, code, onChange, value]);

    return (
        <CodeBox
            {...passProps}
            ref={ref}
            sx={{
                maxHeight: rows && `${parseInt(rows.toString()) * 1.45}em`,
            }}
            onBlurCapture={formatter && (() => jarRef.current?.updateCode(formatter(value)))}
        >
            {value}
        </CodeBox>
    );
});
