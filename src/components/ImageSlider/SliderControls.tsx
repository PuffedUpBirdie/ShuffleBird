import { Box, IconButton, LinearProgress } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrowRounded";
import NextIcon from "@mui/icons-material/SkipNextRounded";
import PreviousIcon from "@mui/icons-material/SkipPreviousRounded";
import PauseIcon from "@mui/icons-material/PauseRounded";
import StopIcon from "@mui/icons-material/StopRounded";
import React from "react";

interface IProps {
  // folders: string[];
  progress: number;
  isPaused: boolean;
  hideProgressBar?: boolean;
  // interval: number;
  onStart(): void;
  onPreviousImage(): void;
  onNextImage(): void;
  onPause(): void;
  onStop(): void;
}

interface IState {
  files: string[];
  src: string;
  progress: number;
}

export default class SliderControls extends React.Component<IProps, IState> {
  componentDidMount(): void {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount(): void {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = (e: KeyboardEvent) => {
    console.log(e);
    e.preventDefault();

    switch (e.key) {
      case "ArrowRight":
        this.props.onNextImage();
        return;
      case "ArrowLeft":
        this.props.onPreviousImage();
        return;
      case " ":
        this.props.isPaused ? this.props.onStart() : this.props.onPause();
        return;
      case "Escape":
        this.props.onStop();
        return;
    }
  };

  render = () => (
    <div className="image-controls">
      <Box my={1}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="button-container">
            {/* Previous Image */}
            <IconButton
              aria-label="previous"
              onClick={this.props.onPreviousImage}
            >
              <PreviousIcon />
            </IconButton>
            {/* Play */}
            {this.props.isPaused && (
              <IconButton aria-label="play" onClick={this.props.onStart}>
                <PlayIcon />
              </IconButton>
            )}
            {/* Pause */}
            {!this.props.isPaused && (
              <IconButton aria-label="pause" onClick={this.props.onPause}>
                <PauseIcon />
              </IconButton>
            )}
            {/* Stop */}
            <IconButton aria-label="stop" onClick={this.props.onStop}>
              <StopIcon />
            </IconButton>
            {/* Next Image */}
            <IconButton aria-label="next" onClick={this.props.onNextImage}>
              <NextIcon />
            </IconButton>
          </div>
        </div>

        {/* Progress bar */}
        {!this.props.hideProgressBar && (
          <Box mt={1}>
            <LinearProgress
              sx={{ border: "1px solid black" }}
              variant="determinate"
              value={this.props.progress}
            />
          </Box>
        )}
      </Box>
    </div>
  );
}
