import { ContentCopy } from "@mui/icons-material";
import { IconButton, Stack, Tooltip, Typography, TypographyProps } from "@mui/material";
import React from "react";
import { useCopyClipboard } from "../hooks/useCopyClipboard";

interface Props extends TypographyProps {
    value: string;
}

export function TextWithCopy({ value, children, ...props }: Props) {
    const [isCopied, copy] = useCopyClipboard();
    return (
        <Stack component={Typography} direction="row" alignItems="center" whiteSpace="nowrap" {...props}>
            <>{children || value}</>
            <Tooltip title={isCopied ? "Copied!" : "Copy"} placement="top">
                <IconButton
                    size="small"
                    onClick={(e) => {
                        copy(value);
                        e.stopPropagation();
                    }}
                >
                    <ContentCopy fontSize="inherit" />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}
