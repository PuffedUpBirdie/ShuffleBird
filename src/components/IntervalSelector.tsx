import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Input,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import { getSettings, setSettings } from "../utils/localStorage";
import { AutoButtonGroup } from "./ButtonGroup";

interface IProps {
  selected_interval?: number;
  onSetInterval: (interval: number) => void;
  onBack: () => void;
  start: () => void;
}

const intervals = [
  { name: "No Interval", value: Infinity },
  10,
  30,
  { name: "1m", value: 60 },
  { name: "2m", value: 120 },
  { name: "3m", value: 180 },
  { name: "4m", value: 240 },
  { name: "5m", value: 300 },
];

export function IntervalSelector(props: IProps) {
  const [showImagePath, setShowImagePath] = useState<boolean>(
    getSettings().showImagePath,
  );
  const [useSessionSettings, setUseSessionSettings] = useState<boolean>();
  const [sessionCount, setSessionCount] = useState(5);

  const handleChangeImagePath = (
    event: React.ChangeEvent<HTMLInputElement>,
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
          <AutoButtonGroup
            choices={intervals}
            selected={props.selected_interval}
            onSelect={props.onSetInterval}
          />
          <Input
            size="small"
            onChange={(e) => {
              const value = e.target.value || "";
              if (!value) return props.onSetInterval(Infinity);
              const interval = +value.replace("-", "");
              !isNaN(interval) && interval > 0 && props.onSetInterval(interval);
            }}
            value={
              props.selected_interval === Infinity
                ? "-"
                : (props.selected_interval ?? "")
            }
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
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDropDown />}>
              extra settings
            </AccordionSummary>
            <AccordionDetails sx={{ marginInline: "20px 0" }}>
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useSessionSettings}
                      onChange={() =>
                        setUseSessionSettings(!useSessionSettings)
                      }
                    />
                  }
                  label="Session limits"
                />
                {useSessionSettings && (
                  <Box sx={{ marginInline: "20px 0 " }}>
                    <p style={{ color: "gray" }}>number of images</p>
                    <AutoButtonGroup
                      choices={[1, 2, 3, 5, 10, 15, 20, 40]}
                      selected={sessionCount}
                      onSelect={(selected) => {
                        setSessionCount(selected);
                        console.log(selected);
                      }}
                    />
                    <Input
                      size="small"
                      onChange={(e) => {
                        const value = e.target.value || "";
                        if (!value) return setSessionCount(0);
                        const _sessionCount = +value.replace("-", "");
                        !isNaN(_sessionCount) &&
                          _sessionCount > 0 &&
                          setSessionCount(_sessionCount);
                      }}
                      value={sessionCount}
                      sx={{
                        mx: 1,
                        maxWidth: "5rem",
                        input: {
                          textAlign: "center",
                        },
                      }}
                    ></Input>
                    <p style={{ color: "gray" }}>
                      session time: ~
                      {Math.ceil((props.selected_interval * sessionCount) / 60)}{" "}
                      min
                    </p>
                  </Box>
                )}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
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
