import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ImageList,
  ImageListItem,
  Box,
} from "@mui/material";
import { useCallback, useEffect } from "react";

const StopDialog = ({
  isOpen,
  onClose,
  onExit,
  onResume,
  isSessionComplete = false,
  imageSamples = [],
  viewedImagesCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
  onResume: () => void;
  isSessionComplete?: boolean;
  imageSamples?: Array<[string, string]>;
  viewedImagesCount?: number;
}) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      // Disable keyboard controls when dialog is closed
      if (!isOpen) return;

      e.preventDefault();

      switch (e.key) {
        case " ":
          onResume();
          return;
        case "Escape":
          onExit();
          return;
      }
    },
    [isOpen, onExit, onResume],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={isSessionComplete && imageSamples?.length ? "lg" : undefined}
      fullWidth
      sx={{ "& strong": { color: "#25d92a" } }}
      // Disable esc key because we're handling it differently
      disableEscapeKeyDown
    >
      <DialogTitle>
        {isSessionComplete
          ? "Session Complete!"
          : "Are you sure you want to stop?"}
      </DialogTitle>
      <DialogContent>
        {isSessionComplete && viewedImagesCount > 0 && (
          <DialogContentText>
            You have viewed <strong>{viewedImagesCount}</strong> image
            {viewedImagesCount !== 1 ? "s" : ""} in this session.
          </DialogContentText>
        )}
        <DialogContentText pt={1}>
          Hit <strong>Esc</strong> to stop the slide show.
        </DialogContentText>
        <DialogContentText>
          Hit <strong>Space</strong> to resume.
        </DialogContentText>

        {isSessionComplete && imageSamples?.length > 0 && (
          <>
            <br />
            <DialogContentText>Latest viewed images:</DialogContentText>
            <Box sx={{ maxHeight: "600px", overflow: "auto" }}>
              <ImageList cols={4} gap={8}>
                {imageSamples.map(([filename, src], index) => (
                  <ImageListItem key={index}>
                    <img
                      src={src}
                      loading="lazy"
                      style={{ objectFit: "cover", height: "200px" }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onExit}>Stop</Button>
        <Button onClick={onResume}>Resume</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StopDialog;
