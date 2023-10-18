import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input
} from "@mui/material";
import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface IProps {
  interval?: number
  setInterval: (interval: number) => void
  onBack: () => void
  start: () => void
}

export function IntervalSelector(props: IProps) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={props.onBack}
          aria-label="back"
        >
          <ChevronLeftIcon />
        </IconButton>
        Select Interval
      </div>
      <div>
        <Box my={1}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              color={props.interval === Infinity ? "info" : undefined}
              onClick={() => {
                props.setInterval(Infinity);
              }}
            >
              No Interval
            </Button>
            <Button
              color={props.interval === 10 ? "info" : undefined}
              onClick={() => {
                props.setInterval(10);
              }}
            >
              10
            </Button>
            <Button
              color={props.interval === 30 ? "info" : undefined}
              onClick={() => {
                props.setInterval(30);
              }}
            >
              30
            </Button>
            <Button
              color={props.interval === 60 ? "info" : undefined}
              onClick={() => {
                props.setInterval(60);
              }}
            >
              60
            </Button>
            <Button
              color={props.interval === 120 ? "info" : undefined}
              onClick={() => {
                props.setInterval(120);
              }}
            >
              120
            </Button>
            <Button
              color={props.interval === 240 ? "info" : undefined}
              onClick={() => {
                props.setInterval(240);
              }}
            >
              240
            </Button>
            <Button
              color={props.interval === 300 ? "info" : undefined}
              onClick={() => {
                props.setInterval(300);
              }}
            >
              300
            </Button>
          </ButtonGroup>
          <Input
            size="small"
            onChange={(e) => !isNaN(+e.target.value) && props.setInterval(+e.target.value)}
            value={props.interval === Infinity ? "-" : props.interval ?? ''}
            sx={{
              mx: 1,
              maxWidth: "5rem",
              input: {
                textAlign: "center",
              },
            }}
          ></Input>
        </Box>
      </div>
      <div>
        <Button variant="contained" className="wide" onClick={props.start}>
          Start
        </Button>
      </div>
    </div>
  );
}
