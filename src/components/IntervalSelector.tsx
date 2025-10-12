import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Input,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useState } from "react";
import { getSettings, setSettings } from "../utils/localStorage";

interface IProps {
  interval?: number;
  setInterval: (interval: number) => void;
  onBack: () => void;
  start: () => void;
}

const intervals = [10, 30, 60, 120, 240, 300];

export function IntervalSelector(props: IProps) {
  const [showImagePath, setShowImagePath] = useState<boolean>(
    getSettings().showImagePath
  );

  const handleChangeImagePath = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const showImagePath = event.target.checked;
    const settings = getSettings();
    setSettings({ ...settings, showImagePath });
    setShowImagePath(showImagePath);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton onClick={props.onBack} aria-label="back">
          <ChevronLeftIcon />
        </IconButton>
        Select Interval
      </div>
      <div>
        <Box my={1}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              color={props.interval === Infinity ? "info" : undefined}
              onClick={() => {
                props.setInterval(Infinity);
              }}
            >
              No Interval
            </Button>

            {intervals.map((interval) => (
              <Button
                key={interval}
                color={props.interval === interval ? "info" : undefined}
                onClick={() => {
                  props.setInterval(interval);
                }}
              >
                {interval}
              </Button>
            ))}
          </ButtonGroup>
          <Input
            size="small"
            onChange={(e) =>
            {
              const value = e.target.value || '';
              if(!value) return props.setInterval(Infinity);
              const interval = +value.replace('-', '');
              !isNaN(interval) && interval > 0 && props.setInterval(interval)
            }
            }
            value={props.interval === Infinity ? "-" : props.interval ?? ""}
            sx={{
              mx: 1,
              maxWidth: "5rem",
              input: {
                textAlign: "center",
              },
            }}
          ></Input>
        </Box>
      </div>
      <div>
        <Box mb={1}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showImagePath}
                  onChange={handleChangeImagePath}
                />
              }
              label="Show image path"
            />
          </FormGroup>
        </Box>
      </div>
      <div>
        <Button variant="contained" className="wide" onClick={props.start}>
          Start
        </Button>
      </div>
    </div>
  );
}
