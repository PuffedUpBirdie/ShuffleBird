import { Box, IconButton, LinearProgress } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrowRounded";
import NextIcon from "@mui/icons-material/SkipNextRounded";
import PreviousIcon from "@mui/icons-material/SkipPreviousRounded";
import PauseIcon from "@mui/icons-material/PauseRounded";
import StopIcon from "@mui/icons-material/StopRounded";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";
import React from "react";

const CONTROLS_HIDE_DELAY = 3000;

interface IProps {
  progress: number;
  isPaused: boolean;
  hideProgressBar?: boolean;
  isDisabled?: boolean;
  isPlayPauseDisabled?: boolean;
  onStart(): void;
  onPreviousImage(): void;
  onNextImage(): void;
  onPause(): void;
  onStop(): void;
}

interface IState {
  isFullscreen: boolean;
  activatedFullscreen: boolean;
  controlsHidden: boolean;
}

export default class SliderControls extends React.Component<IProps, IState> {
  hideTimer?: number;

  constructor(props: IProps) {
    super(props);
    this.state = {
      isFullscreen: false,
      controlsHidden: false,
      // We try to check if the user set fullscreen from the slides control.
      // If he did, we need to remember this so we'll get him out of fulscreen when he leaves.
      // If the user entered fullscreen from OS controls, then we'll leave it there.
      // Decided this for now so that the user won't get stuck in fullscreen mode in case he doesn't know how to exit.
      activatedFullscreen: false,
    };
  }

  async componentDidMount(): Promise<void> {
    document.addEventListener("keydown", this.handleKeyPress);
    document.addEventListener("mousemove", this.handleMouseMove);
    this.scheduleHide();
    const isFullscreen = await window.funcs.isFullscreen();
    this.setState({ isFullscreen });
    window.funcs.addFullscreenEventHandler(this.updateFullscreenValue);
  }

  componentDidUpdate(prevProps: IProps): void {
    const wasPlaying = !prevProps.isPaused && !prevProps.isDisabled;
    const isPlaying = !this.props.isPaused && !this.props.isDisabled;
    if (wasPlaying === isPlaying) return;

    if (isPlaying) this.scheduleHide();
    else {
      if (this.hideTimer) window.clearTimeout(this.hideTimer);
      this.revealControls();
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener("keydown", this.handleKeyPress);
    document.removeEventListener("mousemove", this.handleMouseMove);
    if (this.hideTimer) window.clearTimeout(this.hideTimer);
    window.funcs.removeFullscreenEventHandler(this.updateFullscreenValue);
    if (this.state.activatedFullscreen && this.state.isFullscreen)
      window.funcs.setFullscreen(false);
  }

  scheduleHide = (): void => {
    if (this.hideTimer) window.clearTimeout(this.hideTimer);
    if (this.props.isPaused || this.props.isDisabled) return;
    this.hideTimer = window.setTimeout(
      () => this.setState({ controlsHidden: true }),
      CONTROLS_HIDE_DELAY,
    );
  };

  revealControls = (): void => {
    if (this.state.controlsHidden) this.setState({ controlsHidden: false });
  };

  handleMouseMove = (): void => {
    this.revealControls();
    this.scheduleHide();
  };

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
    if (this.props.isDisabled) return;

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
    <div
      className="image-controls"
      style={
        this.state.controlsHidden
          ? {
              transition: "opacity 0.3s ease",
              opacity: 0,
              pointerEvents: "none",
            }
          : { transition: "opacity 0.3s ease" }
      }
    >
      <Box my={1}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="button-container">
            {/* Previous Image */}
            <IconButton
              aria-label="previous"
              onClick={this.props.onPreviousImage}
              disabled={this.props.isDisabled}
            >
              <PreviousIcon />
            </IconButton>
            {/* Play */}
            {!this.props.isPlayPauseDisabled && this.props.isPaused && (
              <IconButton
                aria-label="play"
                onClick={this.props.onStart}
                disabled={this.props.isDisabled}
              >
                <PlayIcon />
              </IconButton>
            )}
            {/* Pause */}
            {!this.props.isPlayPauseDisabled && !this.props.isPaused && (
              <IconButton
                aria-label="pause"
                onClick={this.props.onPause}
                disabled={this.props.isDisabled}
              >
                <PauseIcon />
              </IconButton>
            )}
            {/* Stop */}
            <IconButton
              aria-label="stop"
              onClick={this.props.onStop}
              disabled={this.props.isDisabled}
            >
              <StopIcon />
            </IconButton>
            {/* Next Image */}
            <IconButton
              aria-label="next"
              onClick={this.props.onNextImage}
              disabled={this.props.isDisabled}
            >
              <NextIcon />
            </IconButton>
            |{/* Fullscreen */}
            <IconButton
              aria-label="fullscreen"
              onClick={this.toggleFullscreen}
              disabled={this.props.isDisabled}
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
