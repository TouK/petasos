import React from "react"
import {useObserver} from "mobx-react-lite";
import {makeStyles} from "@material-ui/core/styles";
import {Button, CircularProgress} from "@material-ui/core";

export const LoadingButton = ({loading, text, onClick, ...props}) => {
    return useObserver(() => {
        const useStyles = makeStyles((theme) => ({
            root: {
                display: 'flex',
                alignItems: 'center',
            },
            wrapper: {
                margin: theme.spacing(1),
                position: 'relative',
            },
            buttonProgress: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -12,
                marginLeft: -12,
            }
        }));

        const classes = useStyles();

        return (
            <div className={classes.wrapper}>
                <Button
                    disabled={loading}
                    onClick={onClick}
                    {...props}
                >
                    {text}
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
            </div>
        )
    })
}