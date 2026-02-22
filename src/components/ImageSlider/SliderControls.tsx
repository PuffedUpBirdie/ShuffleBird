import { Box, IconButton, LinearProgress } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrowRounded";
import NextIcon from "@mui/icons-material/SkipNextRounded";
import PreviousIcon from "@mui/icons-material/SkipPreviousRounded";
import PauseIcon from "@mui/icons-material/PauseRounded";
import StopIcon from "@mui/icons-material/StopRounded";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";
import React from "react";

interface IProps {
  progress: number;
  isPaused: boolean;
  hideProgressBar?: boolean;
  isDialogOpen?: boolean;
  onStart(): void;
  onPreviousImage(): void;
  onNextImage(): void;
  onPause(): void;
  onStop(): void;
}

interface IState {
  isFullscreen: boolean;
  activatedFullscreen: boolean;
}

export default class SliderControls extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isFullscreen: false,
      // We try to check if the user set fullscreen from the slides control.
      // If he did, we need to remember this so we'll get him out of fulscreen when he leaves.
      // If the user entered fullscreen from OS controls, then we'll leave it there.
      // Decided this for now so that the user won't get stuck in fullscreen mode in case he doesn't know how to exit.
      activatedFullscreen: false,
    };
  }

  async componentDidMount(): Promise<void> {
    document.addEventListener("keydown", this.handleKeyPress);
    const isFullscreen = await window.funcs.isFullscreen();
    this.setState({ isFullscreen });
    window.funcs.addFullscreenEventHandler(this.updateFullscreenValue);
  }

  componentWillUnmount(): void {
    document.removeEventListener("keydown", this.handleKeyPress);
    window.funcs.removeFullscreenEventHandler(this.updateFullscreenValue);
    if (this.state.activatedFullscreen && this.state.isFullscreen)
      window.funcs.setFullscreen(false);
  }

  updateFullscreenValue = (isEnabled: boolean): void => {
    this.setState({ isFullscreen: isEnabled });
  };

  toggleFullscreen = async (): Promise<void> => {
    const isFullscreen = await window.funcs.isFullscreen();
    if (!isFullscreen) {
      if (!this.state.activatedFullscreen)
        this.setState({ activatedFullscreen: true });
      window.funcs.setFullscreen(true);
    } else window.funcs.setFullscreen(false);
  };

  handleKeyPress = (e: KeyboardEvent) => {
    // Disable keyboard controls when dialog is open
    if (this.props.isDialogOpen) return;

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
              disabled={this.props.isDialogOpen}
            >
              <PreviousIcon />
            </IconButton>
            {/* Play */}
            {this.props.isPaused && (
              <IconButton
                aria-label="play"
                onClick={this.props.onStart}
                disabled={this.props.isDialogOpen}
              >
                <PlayIcon />
              </IconButton>
            )}
            {/* Pause */}
            {!this.props.isPaused && (
              <IconButton
                aria-label="pause"
                onClick={this.props.onPause}
                disabled={this.props.isDialogOpen}
              >
                <PauseIcon />
              </IconButton>
            )}
            {/* Stop */}
            <IconButton
              aria-label="stop"
              onClick={this.props.onStop}
              disabled={this.props.isDialogOpen}
            >
              <StopIcon />
            </IconButton>
            {/* Next Image */}
            <IconButton
              aria-label="next"
              onClick={this.props.onNextImage}
              disabled={this.props.isDialogOpen}
            >
              <NextIcon />
            </IconButton>
            |{/* Fullscreen */}
            <IconButton
              aria-label="fullscreen"
              onClick={this.toggleFullscreen}
              disabled={this.props.isDialogOpen}
            >
              {this.state.isFullscreen ? <FullscreenExit /> : <Fullscreen />}
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
