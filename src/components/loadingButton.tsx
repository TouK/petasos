import { Button, CircularProgress, styled } from "@mui/material";
import { useObserver } from "mobx-react-lite";
import React from "react";

const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  margin: theme.spacing(1),
  position: "relative",
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export const LoadingButton = ({ loading, text, onClick, ...props }) => {
  return useObserver(() => {
    return (
      <Wrapper>
        <Button disabled={loading} onClick={onClick} {...props}>
          {text}
        </Button>
        {loading && <CircularProgress size={24} className="buttonProgress" />}
      </Wrapper>
    );
  });
};
