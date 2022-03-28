import {
    Button,
    Dialog,
    IconButton,
    ListItem,
    Pagination,
    Paper,
    styled,
    Tooltip
} from "@mui/material";
import React from "react";

export const SmallIconButton = styled(IconButton)({
    ".MuiSvgIcon-root": {
        fontSize: "1.0rem"
    }
});

export const StyledPagination = styled(Pagination)({
    ul: {
        justifyContent: "center"
    }
});

export const StyledListItem = styled(ListItem)({
    paddingTop: "2px",
    paddingBottom: "2px",
    margin: "4px 0 4px 0",
    ".Mui-selected": {
        backgroundColor: "rgba(0, 0, 0, 0.2)"
    }
});

export const DarkTooltip = styled(Tooltip)({
    arrow: {
        color: "#000000"
    },
    tooltip: {
        backgroundColor: "#404040"
    }
});

export const StyledButton = styled(Button)({
    width: "100%"
});

export const StyledDialog = styled(Dialog)({
    ".MuiPaper-root": {
        backgroundColor: "#585858",
        color: "#BBBBBB",
        maxWidth: "1200px"
    },
    ".MuiDialogContentText-root": {
        color: "#BBBBBB"
    }
});

export const StyledPaper = styled(Paper)({
    backgroundColor: "#585858",
    color: "#CCCCCC",
    ".MuiTableCell-body": {
        color: "#CCCCCC"
    },
    boxShadow: "none"
});

export const StyledTopicCard = styled(Paper)((theme) => ({
    backgroundColor: "#616161",
    color: "#CCCCCC",
    marginBottom: "5px",
    ".MuiCardContent-root, .MuiCardContent-root:last-child": {
        padding: "10px"
    },
    boxShadow: "none"
}));
