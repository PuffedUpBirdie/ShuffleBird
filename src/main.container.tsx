import React from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainMenu from "./components/MainMenu";
import ImageSlider from "./components/ImageSlider";

interface IProps { }

interface IState {
  selectedFolders: string[],
  interval?: number
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
      interval: null
    };
  }

  onDirselected = (dirs: string[], interval: number) => { this.setState({ selectedFolders: dirs, interval }) }

  returnToMainMenu = () => this.setState({ selectedFolders: null })

  render(): any {
  return(
    <ThemeProvider theme={darkTheme}>
      {this.state.selectedFolders && this.state.selectedFolders.length
        ? (<ImageSlider
            folders={this.state.selectedFolders}
            onStop={this.returnToMainMenu}
            interval={this.state.interval} />)
        : (<MainMenu 
            onDirSelected={this.onDirselected} />)
      }
    </ThemeProvider>
  )}
}