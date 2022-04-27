import { Container, Stack, styled, Typography } from "@mui/material";
import React from "react";

export const Footer = () => {
  return (
    <Container maxWidth="lg">
      <Stack
        alignItems="baseline"
        justifyContent="flex-end"
        direction="row"
        spacing={0.5}
        sx={{ opacity: 0.4, filter: "saturate(0)" }}
      >
        <Typography variant="overline" color="background.paper">
          POWERED BY
        </Typography>
        <Img src="https://hermes-pubsub.readthedocs.io/en/latest/img/hermes.png" />
      </Stack>
    </Container>
  );
};

const Img = styled("img")({ height: "3.2em" });
