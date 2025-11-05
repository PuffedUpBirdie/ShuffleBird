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
import EditIcon from "@mui/icons-material/Edit";
import { Header } from "./Header";
import { IntervalSelector } from "./IntervalSelector";

interface IProps {
  onDirSelected(
    filepaths: string[],
    interval: number,
    sessionLimitEnabled: boolean,
    sessionImageCount: number,
  ): void;
}

interface IState {
  folders: string[];
  interval: number;
  datasets: Record<string, string[]>;
  showDatasetCreation: boolean;
  datasetToEdit?: string;
  sessionLimitEnabled: boolean;
  sessionImageCount: number;
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
      sessionLimitEnabled: false,
      sessionImageCount: 5,
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
    const newDatasets = { ...this.state.datasets };
    if (this.state.datasetToEdit && name !== this.state.datasetToEdit) {
      delete newDatasets[this.state.datasetToEdit];
    }

    newDatasets[name] = folders;

    this.setState({
      datasets: newDatasets,
      showDatasetCreation: false,
      datasetToEdit: undefined,
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

  start = (sessionLimitEnabled: boolean, sessionImageCount: number) => {
    this.props.onDirSelected(
      this.state.folders,
      this.state.interval,
      sessionLimitEnabled,
      sessionImageCount,
    );
  };

  clearFolders = () => {
    this.setState({ folders: null });
  };

  render() {
    const showDatasetForm =
      this.state.showDatasetCreation || this.state.datasetToEdit;

    return (
      <>
        <div className="main">
          <div className="main-menu">
            <Header />
            {/* Folder Selection */}
            {!this.state.folders && !showDatasetForm && (
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
                            aria-label="edit"
                            onClick={() =>
                              this.setState({ datasetToEdit: datasetKey })
                            }
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => this.removeDataSet(datasetKey)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
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
            {showDatasetForm && (
              <DatasetCreation
                datasetToEdit={this.state.datasetToEdit}
                existingCollections={this.state.datasets}
                onSave={this.saveDataSet}
                onCancel={() =>
                  this.setState({
                    showDatasetCreation: false,
                    datasetToEdit: undefined,
                  })
                }
              />
            )}

            {/* Interval Selection */}
            {this.state.folders?.length && !showDatasetForm && (
              <IntervalSelector
                onBack={this.clearFolders}
                selectedInterval={this.state.interval}
                onSetInterval={this.setInterval}
                start={this.start}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}
