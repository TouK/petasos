import FileCopyIcon from "@mui/icons-material/FileCopy";
import React from "react";
import {HermesFrontendUrl} from "../config";
import {useCopyClipboard} from "../hooks/useCopyClipboard";
import topicBarStyles from "../styles/topic-bar.css";
import {DarkTooltip, SmallIconButton} from "./styledMuiComponents";

export const TopicFrontendUrl = ({topic}: { topic: string }) => {
    const [isCopied, copy] = useCopyClipboard();
    return (
        <div
            className={topicBarStyles.TopicUrl}>
            {`${HermesFrontendUrl}/topics/${topic}`}
            <DarkTooltip title={isCopied
                ? "Copied!"
                : "Copy"} placement="top">
                <SmallIconButton size="small" color="primary" type="button"
                                 onClick={() => copy(`${HermesFrontendUrl}/topics/${topic}`)}><FileCopyIcon /></SmallIconButton>
            </DarkTooltip>
        </div>
    );
};
