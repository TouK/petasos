import { deepPurple, lightGreen } from "@mui/material/colors";
import { createTheme as createMuiTheme } from "@mui/material/styles";

export const theme = createMuiTheme({
    palette: {
        mode: "dark",
        primary: {
            main: lightGreen["300"],
        },
        secondary: {
            main: deepPurple["200"],
        },
        error: {
            main: `#F25C6E`,
        },
        success: {
            main: `#5CB85C`,
            contrastText: `#FFFFFF`,
        },
        background: {
            default: "#B3B3B3",
            paper: "#4D4D4D",
        },
    },
});
