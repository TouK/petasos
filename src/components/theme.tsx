import {createMuiTheme} from "@material-ui/core";

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ccc'
        },
        secondary: {
            main: '#536436',
            dark: '#4a5930'
        },
        info: {
            main: '#717171',
            light: '#6e6e6e',
            dark: '#5c5c5c'

        }
    },
})

export const formTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#b4c498'
        },
        secondary: {
            main: '#536436',
            dark: '#4a5930'
        }
    },
    overrides: {
        MuiSvgIcon: {
            root: {
                color: '#bbb'
            }
        },
        MuiInputBase: {
            input: {
                color: '#bbb'
            }
        },
        MuiFormLabel: {
            root: {
                color: '#aaa'
            }
        },
        MuiInput: {
            underline: {
                '&&&&:before': {
                    borderBottom: '1px solid #8D8D8D'
                }
            }
        },
        MuiPaper: {
            root: {
                backgroundColor: '#585858',
                color: '#ccc',
                '& .MuiTableCell-body': {
                    color: '#ccc'
                },
                boxShadow: 'none'
            }
        }
    }
})

export const calendarTheme = createMuiTheme({
    ...formTheme,
    overrides: {
        ...formTheme.overrides,
        MuiPaper: {
            root: {
                backgroundColor: '#6d6d6d'
            }
        },
        MuiTab: {
            root: {
                backgroundColor: '#454545'
            }
        }
    }
})