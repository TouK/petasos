import { Container, Stack, styled, Typography } from "@mui/material";
import React from "react";

export const Footer = () => {
    return (
        <Container maxWidth="lg">
            <Stack alignItems="baseline" justifyContent="flex-end" direction="row" spacing={0.5}>
                <Typography variant="caption" color="background.paper" sx={{ opacity: 0.5, fontSize: ".6em" }}>
                    {_VERSION_}
                </Typography>
            </Stack>
        </Container>
    );
};

const Img = styled("img")({ height: "2.6em" });
