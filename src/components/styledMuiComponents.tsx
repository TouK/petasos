import React from "react"
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from '@material-ui/core/styles';
import {Pagination} from "@material-ui/lab";
import {Button, Dialog, ListItem, Paper, Tooltip} from "@material-ui/core";

export const SmallIconButton = withStyles({
    root: {
        '& .MuiSvgIcon-root': {
            fontSize: '1.0rem',
        }

    }
})(IconButton)

export const StyledPagination = withStyles({
    ul: {
        justifyContent: "center"
    }
})(Pagination)

export const StyledListItem = withStyles({
    root: {
        paddingTop: '2px',
        paddingBottom: '2px',
        margin: '4px 0 4px 0',
        '& .Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }
    }
})(ListItem)

export const DarkTooltip = withStyles({
    arrow: {
        color: '#000'
    },
    tooltip: {
        backgroundColor: '#404040'
    }
})(Tooltip)

export const StyledButton = withStyles({
    root: {
        width: '100%'
    }
})(Button)

export const StyledDialog = withStyles({
    root: {
        '& .MuiPaper-root': {
            backgroundColor: '#585858',
            color: '#bbb',
            maxWidth: '1200px'
        },
        '& .MuiDialogContentText-root': {
            color: '#bbb'
        }
    }
})(Dialog)

export const StyledPaper = withStyles({
    root: {
        backgroundColor: '#585858',
        color: '#ccc',
        '& .MuiTableCell-body': {
            color: '#ccc'
        },
        boxShadow: 'none'
    }
})(Paper)

export const StyledTopicCard = withStyles((theme) => ({
    root: {
        backgroundColor: '#616161',
        color: '#ccc',
        marginBottom: '5px',
        '& .MuiCardContent-root': {
            padding: '10px'
        },
        boxShadow: 'none'
    }
}))(Paper)