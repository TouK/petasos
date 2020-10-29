import React from "react"
import topicBarStyles from "../styles/topic-bar.css";
import {HermesFrontendUrl} from "../config";
import {DarkTooltip, SmallIconButton} from "./styledMuiComponents";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import {useCopyClipboard} from "../hooks/useCopyClipboard";

export const TopicFrontendUrl = ({topic}: { topic: string }) => {
    const [isCopied, copy] = useCopyClipboard()
    return (
        <div
            className={topicBarStyles.TopicUrl}>
            {`${HermesFrontendUrl}/topics/${topic}`}
            <DarkTooltip title={isCopied ? "Copied!" : "Copy"} placement="top">
                <SmallIconButton size="small" color="primary" type="button"
                                 onClick={() => copy(`${HermesFrontendUrl}/topics/${topic}`)}><FileCopyIcon/></SmallIconButton>
            </DarkTooltip>
        </div>
    )
}
