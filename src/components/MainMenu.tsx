import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React from "react";
import DatasetCreation from "./CreateCollection";
import DeleteIcon from "@mui/icons-material/Delete";
import { Header } from "./Header";
import { IntervalSelector } from "./IntervalSelector";

interface IProps {
  onDirSelected(filepaths: string[], interval: number): void;
}

interface IState {
  folders: string[];
  interval: number;
  datasets: Record<string, string[]>;
  showDatasetCreation: boolean;
}

export default class MainMenu extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const localData = localStorage.getItem("datasets");
    const datasets = localData ? JSON.parse(localData) : {};

    this.state = {
      folders: null,
      interval: Infinity,
      datasets,
      showDatasetCreation: false,
    };
  }

  onLoadFolder = async () => {
    const result = await window.funcs.loadFolder();
    if (result.canceled) return;

    console.log(result);

    this.setState({ folders: result.filePaths });
  };

  createNewDataset = () => this.setState({ showDatasetCreation: true });
  closeNewDataset = () => this.setState({ showDatasetCreation: false });
  saveDataSet = (name: string, folders: string[]) => {
    const newDatasets = { ...this.state.datasets, [name]: folders };
    this.setState({
      datasets: newDatasets,
      showDatasetCreation: false,
    });

    this.saveDatasets(newDatasets);
  };

  removeDataSet = (dataset: string) => {
    const { [dataset]: _, ...rest } = this.state.datasets;
    this.setState({ datasets: rest });

    this.saveDatasets(rest);
  };

  saveDatasets = (datasets: Record<string, string[]>) => {
    localStorage.setItem("datasets", JSON.stringify(datasets));
  };

  setInterval = (interval: number) => {
    this.setState({ interval });
  };

  start = () => {
    this.props.onDirSelected(this.state.folders, this.state.interval);
  };

  clearFolders = () => {
    this.setState({ folders: null });
  };

  render() {
    return (
      <>
        <div className="main">
          <div className="main-menu">
            <Header />
            {/* Folder Selection */}
            {!this.state.folders && !this.state.showDatasetCreation && (
              <div>
                <div>
                  <Button
                    className="wide"
                    variant="contained"
                    onClick={this.onLoadFolder}
                  >
                    Quick shuffle folder
                  </Button>
                </div>
                <div>
                  <div style={{ margin: "1rem 0" }}>
                    or select a collection:
                  </div>
                  <List
                    sx={{ width: "100%", bgcolor: "background.paper" }}
                    subheader={
                      !Object.keys(this.state.datasets).length && (
                        <ListSubheader
                          component="div"
                          id="nested-list-subheader"
                        >
                          {Object.keys(this.state.datasets).length
                            ? "Collections"
                            : "You have no collections created"}
                        </ListSubheader>
                      )
                    }
                  >
                    {Object.keys(this.state.datasets).map(
                      (datasetKey, index) => (
                        <ListItem disablePadding key={index}>
                          <ListItemButton
                            onClick={() =>
                              this.setState({
                                folders: this.state.datasets[datasetKey],
                              })
                            }
                          >
                            <ListItemText primary={datasetKey} />
                          </ListItemButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => this.removeDataSet(datasetKey)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ),
                    )}
                  </List>
                </div>
                <div>
                  <Button
                    onClick={this.createNewDataset}
                    variant="contained"
                    className="wide"
                  >
                    + add new collection
                  </Button>
                </div>
              </div>
            )}

            {/* Create New Collection */}
            {this.state.showDatasetCreation && (
              <DatasetCreation
                existingCollections={this.state.datasets}
                onSave={this.saveDataSet}
                onCancel={() => this.setState({ showDatasetCreation: false })}
              />
            )}

            {/* Interval Selection */}
            {this.state.folders?.length && !this.state.showDatasetCreation && (
              <IntervalSelector
                onBack={this.clearFolders}
                interval={this.state.interval}
                setInterval={this.setInterval}
                start={this.start}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}
