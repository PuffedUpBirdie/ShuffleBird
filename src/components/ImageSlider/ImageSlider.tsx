import React from "react";

import { ImageLoader } from "../../utils/imageLoader";
import { Timer } from "../../utils/timer";
import SliderControls from "./SliderControls";
import Loader from "./Loader";

interface IProps {
  folders: string[];
  interval: number;
  onStop(): void;
}

interface IState {
  files: string[];
  src: string;
  progress: number;
  isPaused: boolean;
  hasLoaded: boolean;
}

export default class ImageSlider extends React.Component<IProps, IState> {
  timer: Timer;
  imageLoader: ImageLoader;

  constructor(params: IProps) {
    super(params);

    this.state = {
      files: [],
      src: undefined,
      progress: 0,
      isPaused: false,
      hasLoaded: false,
    };
  }

  componentDidMount(): void {
    window.funcs
      .getDirFilesList(this.props.folders)
      .then((files: string[]) => {
        console.log("f", files);
        this.imageLoader = new ImageLoader(files);
        //this.imageLoader.forward().then(image => )
        this.setState(
          { files: this.state.files.concat(files), hasLoaded: true },
          () => {
            this.loadRandomImage();
            this.timer = new Timer(
              300,
              this.props.interval * 1000,
              this.loadNewImage,
              this.onTick
            );
            this.start();
          }
        );
      })
      .catch(console.error);

    console.log(this.props);
  }

  componentWillUnmount(): void {
    this.timer.release();
  }

  loadNewImage = () => {
    console.log("load new image");
    this.loadRandomImage();
  };

  onTick = (progress: number) => this.setState({ progress });

  loadRandomImage() {
    this.imageLoader
      .forward()
      .then((image: string) => this.setState({ src: image }));
  }

  start = () => {
    this.timer.start();
    this.setState({ isPaused: false });
  };

  previousImage = () => {
    this.imageLoader
      .backwards()
      .then((img: string) => this.setState({ src: img }));
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
    this.props.onStop();
  };

  render() {
    return (
      <div className="image-slider-area">
        {this.state.hasLoaded ? (
          <>
            <div id="image-container">
              {this.state.src && <img src={this.state.src} />}
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
            />
            <div className="progress-bar"></div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}
