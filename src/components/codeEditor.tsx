import { styled, useForkRef } from "@mui/material";
import { CodeJar, Position } from "codejar";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import React, { forwardRef, useEffect, useRef, useState } from "react";

hljs.registerLanguage("json", json);

const CodeBox = styled("div")(({ theme: t }) => ({
  "&": {
    fontFamily: "'Roboto Mono', monospace",
    padding: 0,
    margin: 0,
  },
  "& .hljs-attr": {
    color: t.palette.primary[t.palette.mode === "dark" ? "light" : "dark"],
  },
  "& .hljs-string": {
    color: t.palette.secondary.main,
  },
  "& .hljs-number": {
    color: t.palette.success.light,
  },
  "& .hljs-keyword": {
    color: t.palette.success.light,
  },
  "& .hljs-punctuation": {
    color: t.palette.text.disabled,
  },
}));

export const CodeEditor = forwardRef<
  HTMLDivElement,
  {
    value: string;
    onChange: (code: string) => void;
    rows: number | string;
    disabled?: boolean;
    autoFocus?: boolean;
  }
>(function CodeEditor(props, forwardedRef) {
  const { value, onChange, rows, disabled, autoFocus, ...passProps } = props;

  const editorRef = useRef<HTMLDivElement>(null);
  const ref = useForkRef<HTMLDivElement, HTMLDivElement>(
    forwardedRef,
    editorRef
  );

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
    return () => jar.destroy();
  }, [autoFocus]);

  //update value from outside
  useEffect(() => {
    if (jarRef.current) {
      jarRef.current.updateCode(value);
      if (disabled) {
        editorRef.current.contentEditable = "false";
      } else {
        positionRef.current && jarRef.current.restore(positionRef.current);
      }
    }
  }, [disabled, value]);

  //call change callback
  useEffect(() => {
    if (!disabled) {
      code && code !== value && onChange(code);
    }
  }, [disabled, code, onChange, value]);

  return (
    <CodeBox
      {...passProps}
      ref={ref}
      sx={{
        maxHeight: rows && `${parseInt(rows.toString()) * 1.45}em`,
      }}
    >
      {value}
    </CodeBox>
  );
});
