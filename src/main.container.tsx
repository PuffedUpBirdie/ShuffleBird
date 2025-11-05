import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MainMenu from "./components/MainMenu";
import ImageSlider from "./components/ImageSlider/ImageSlider";

interface IProps { }

interface IState {
  selectedFolders: string[];
  interval?: number;
  sessionLimitEnabled: boolean;
  sessionImageCount: number;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default class Main extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedFolders: null,
      interval: null,
      sessionLimitEnabled: false,
      sessionImageCount: 5,
    };
  }

  onDirselected = (
    dirs: string[],
    interval: number,
    sessionLimitEnabled: boolean,
    sessionImageCount: number
  ) => {
    this.setState({
      selectedFolders: dirs,
      interval,
      sessionLimitEnabled,
      sessionImageCount,
    });
  };

  returnToMainMenu = () => this.setState({ selectedFolders: null })

  render(): any {
    return (
      <ThemeProvider theme={darkTheme}>
        {this.state.selectedFolders?.length ? (
          <ImageSlider
            folders={this.state.selectedFolders}
            onStop={this.returnToMainMenu}
            interval={this.state.interval}
            sessionLimitEnabled={this.state.sessionLimitEnabled}
            sessionImageCount={this.state.sessionImageCount}
          />
        ) : (
          <MainMenu onDirSelected={this.onDirselected} />
        )}
      </ThemeProvider>
    );
  }
}
