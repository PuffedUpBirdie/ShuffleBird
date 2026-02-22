import React from "react";

import { ImageLoader } from "../../utils/imageLoader";
import { Timer } from "../../utils/timer";
import SliderControls from "./SliderControls";
import Loader from "./Loader";
import { getSettings } from "../../utils/localStorage";
import { ImagePathContainer } from "./ImagePathContainer";
import StopDialog from "./StopDialog";

interface IProps {
  folders: string[];
  interval: number;
  onStop(): void;
  sessionLimitEnabled: boolean;
  sessionImageCount: number;
}

interface IState {
  files: string[];
  filename: string;
  src: string;
  progress: number;
  isPaused: boolean;
  hasLoaded: boolean;
  isClosingModalOpen: boolean;
  isSessionComplete: boolean;
  sessionProgress?: { count: number; sampleImages: [string, string][] };
}

export default class ImageSlider extends React.Component<IProps, IState> {
  timer: Timer;
  imageLoader: ImageLoader;
  settings = getSettings();

  constructor(params: IProps) {
    super(params);

    this.state = {
      files: [],
      filename: "",
      src: undefined,
      progress: 0,
      isPaused: false,
      hasLoaded: false,
      isClosingModalOpen: false,
      isSessionComplete: false,
      sessionProgress: undefined,
    };
  }

  componentDidMount(): void {
    window.funcs
      .getDirFilesList(this.props.folders)
      .then((files: string[]) => {
        this.imageLoader = new ImageLoader(files);
        this.setState(
          { files: this.state.files.concat(files), hasLoaded: true },
          () => {
            this.loadRandomImage();

            const sessionLimit = this.props.sessionLimitEnabled
              ? this.props.sessionImageCount
              : undefined;

            this.timer = new Timer(
              300,
              this.props.interval * 1000,
              this.loadNewImage,
              this.onTick,
              sessionLimit,
              this.onSessionComplete,
            );
            this.start();
          },
        );
      })
      .catch(console.error);
  }

  componentWillUnmount(): void {
    this.timer.release();
  }

  loadNewImage = () => {
    this.loadRandomImage();
  };

  onTick = (progress: number) => this.setState({ progress });

  loadRandomImage() {
    this.imageLoader.forward().then(({ filename, src }) => {
      this.setState(() => ({
        filename,
        src,
      }));
    });
  }

  start = () => {
    this.timer.start();
    this.setState({
      isPaused: false,
      isClosingModalOpen: false,
      sessionProgress: undefined,
    });
  };

  previousImage = () => {
    this.imageLoader.backwards().then((result) => {
      if (!result) return;
      const { filename, src } = result;
      this.setState({ filename, src });
    });
    this.timer.reset();
  };

  nextImage = () => {
    this.loadRandomImage();
    this.timer.reset();
  };

  pause = () => {
    this.timer.pause();
    this.setState({ isPaused: true });
  };

  stop = () => {
    if (this.state.isClosingModalOpen) this.props.onStop();
    else {
      this.setState({
        isClosingModalOpen: true,
        isPaused: true,
        isSessionComplete: false,
      });
      this.timer.pause();
    }
  };

  onSessionComplete = () => {
    console.log("Session limit reached!");
    // Mark as session complete and show the dialog
    this.stop();
    this.setState({
      isSessionComplete: true,
      sessionProgress: this.imageLoader.getProgress(),
    });
  };

  render() {
    return (
      <>
        <div className="image-slider-area">
          {this.state.hasLoaded ? (
            <>
              {this.settings.showImagePath && (
                <ImagePathContainer filename={this.state.filename} />
              )}

              {this.settings.showImmersiveBackground && (
                <img id="immersive-bg" src={this.state.src} />
              )}

              <div id="image-container">
                {this.state.src && (
                  <img
                    src={this.state.src}
                    style={
                      this.settings.contrastMultiplier && {
                        filter: `contrast(${this.settings.contrastMultiplier})`,
                      }
                    }
                  />
                )}
              </div>

              <SliderControls
                onStart={this.start}
                onNextImage={this.nextImage}
                onPreviousImage={this.previousImage}
                onPause={this.pause}
                onStop={this.stop}
                progress={this.state.progress}
                isPaused={this.state.isPaused}
                hideProgressBar={this.props.interval === Infinity}
                isDialogOpen={this.state.isClosingModalOpen}
              />
              <div className="progress-bar"></div>
            </>
          ) : (
            <Loader />
          )}
        </div>
        <StopDialog
          isOpen={this.state.isClosingModalOpen}
          onClose={() =>
            this.setState({
              isClosingModalOpen: false,
              isSessionComplete: false,
              sessionProgress: undefined,
            })
          }
          onExit={this.props.onStop}
          onResume={this.start}
          isSessionComplete={this.state.isSessionComplete}
          imageSamples={this.state.sessionProgress?.sampleImages}
          viewedImagesCount={this.state.sessionProgress?.count}
        />
      </>
    );
  }
}
