import { createTheme as createMuiTheme } from "@mui/material/styles";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#CCCCCC",
    },
    secondary: {
      main: "#536436",
      dark: "#4A5930",
    },
    info: {
      main: "#717171",
      light: "#6E6E6E",
      dark: "#5C5C5C",
    },
  },
});

export const formTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#B4C498",
    },
    secondary: {
      main: "#536436",
      dark: "#4A5930",
    },
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#BBBBBB",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#BBBBBB",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#AAAAAA",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          "&&&&:before": {
            borderBottom: "1px solid #8D8D8D",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#585858",
          color: "#CCCCCC",
          "& .MuiTableCell-body": {
            color: "#CCCCCC",
          },
          boxShadow: "none",
        },
      },
    },
  },
});

export const calendarTheme = createMuiTheme({
  ...formTheme,
  components: {
    ...formTheme.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#6D6D6D",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          backgroundColor: "#454545",
        },
      },
    },
  },
});
