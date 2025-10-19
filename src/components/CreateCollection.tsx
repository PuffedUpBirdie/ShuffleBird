import { useState } from "react";
import Button from "@mui/material/Button";
import {
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Snackbar,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProps {
  datasetToEdit?: string;
  existingCollections: Record<string, string[]>;
  onSave(name: string, folders: string[]): void;
  onCancel(): void;
}

const NewCollection = (props: IProps) => {
  const [name, setName] = useState(
    props.datasetToEdit ? props.datasetToEdit : "",
  );
  const [folders, setFolders] = useState(
    props.datasetToEdit ? props.existingCollections[props.datasetToEdit] : [],
  );
  const [isErrorOpen, setErrorOpen] = useState(false);

  const nameAlreadyTaken =
    name !== props.datasetToEdit &&
    Object.keys(props.existingCollections)
      .map((c) => c.toLocaleLowerCase())
      .includes(name.toLocaleLowerCase());

  const hasInvalidName = !name || nameAlreadyTaken;

  const onLoadFolder = async () => {
    const result = await window.funcs.loadFolder();
    if (result.canceled) return;

    console.log("tst", result);

    const foldersAlreadyExisting = [];
    const foldersToAdd = result.filePaths.filter((folder: string) => {
      if (!folders.includes(folder)) return true;

      foldersAlreadyExisting.push(folder);
      return false;
    });

    if (foldersAlreadyExisting.length) setErrorOpen(true);

    setFolders([...folders, ...foldersToAdd]);
  };

  const removeCollection = (folder: string) => {
    setFolders(folders.filter((f) => f !== folder));
  };

  return (
    <div className="dataset-creation-form">
      <TextField
        id="Name"
        label="Collection Name"
        variant="outlined"
        className="wide"
        value={name}
        error={nameAlreadyTaken}
        helperText={
          nameAlreadyTaken && "A collection with this name already exists"
        }
        onChange={(e) => setName(e.target.value)}
      />
      <List
        sx={{ width: "100%", bgcolor: "background.paper", marginTop: "1rem" }}
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {folders?.length
              ? "Folders:"
              : "You have to select at least a folder for the collection"}
          </ListSubheader>
        }
      >
        {folders.map((folder, index) => (
          <ListItem disablePadding key={index}>
            <ListItemButton>{folder}</ListItemButton>
            <IconButton
              aria-label="delete"
              onClick={() => removeCollection(folder)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button onClick={onLoadFolder} variant="contained" className="wide">
        <span>+ Add Folder To Collection</span>
      </Button>
      <Button
        onClick={() => props.onSave(name, folders)}
        sx={{ marginTop: "1rem" }}
        variant="contained"
        className="wide"
        color="success"
        disabled={!folders.length || hasInvalidName}
      >
        Save
      </Button>
      <Button onClick={props.onCancel} variant="contained" className="wide">
        Cancel
      </Button>
      <Snackbar
        open={isErrorOpen}
        autoHideDuration={6000}
        onClose={() => setErrorOpen(false)}
        message="Folders Skipped"
      >
        <Alert severity="warning">
          Selected folder is already in the list.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NewCollection;
