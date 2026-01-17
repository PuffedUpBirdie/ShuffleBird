import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Input,
  Slider,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import { getSettings, setSettings } from "../utils/localStorage";
import { AutoButtonGroup } from "./ButtonGroup";

interface IProps {
  selectedInterval?: number;
  onSetInterval: (interval: number) => void;
  onBack: () => void;
  start: (sessionLimitEnabled: boolean, sessionImageCount: number) => void;
}

const intervals = [
  { name: "No Interval", value: Infinity },
  { name: "30s", value: 30 },
  { name: "1m", value: 60 },
  { name: "2m", value: 120 },
  { name: "3m", value: 180 },
  { name: "5m", value: 300 },
];

const formatContrastMultiplierText = (value: number) =>
  value === 1 ? "Off" : `x${value}`;

export function IntervalSelector(props: IProps) {
  const settings = getSettings();
  const [showImagePath, setShowImagePath] = useState<boolean>(
    settings.showImagePath,
  );
  const [showImmersiveBackground, setShowImmersiveBackground] =
    useState<boolean>(settings.showImmersiveBackground);
  const [contrastMultiplier, setContrastMultiplier] = useState(
    settings.contrastMultiplier ?? 1,
  );
  const [sessionCount, setSessionCount] = useState(0);

  const toggleShowImagePath = (event: React.ChangeEvent<HTMLInputElement>) => {
    const showImagePath = event.target.checked;
    const settings = getSettings();
    setSettings({ ...settings, showImagePath });
    setShowImagePath(showImagePath);
  };

  const toggleShowImmersiveBackground = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const showImmersiveBackground = event.target.checked;
    const settings = getSettings();
    setSettings({ ...settings, showImmersiveBackground });
    setShowImmersiveBackground(showImmersiveBackground);
  };

  const changeContrastMultiplier = (_: Event, value: number) => {
    const contrastMultiplier = value > 1 ? value : undefined;
    const settings = getSettings();
    setSettings({ ...settings, contrastMultiplier });
    setContrastMultiplier(contrastMultiplier);
  };

  const handleSessionCountChange = (count: number) => {
    setSessionCount(count);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          startIcon={<ChevronLeftIcon />}
          onClick={props.onBack}
          aria-label="back"
        >
          back
        </Button>
      </div>
      <p>Select Interval</p>
      <div>
        <Box my={1}>
          <AutoButtonGroup
            choices={intervals}
            selected={props.selectedInterval}
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
              props.selectedInterval === Infinity
                ? "-"
                : (props.selectedInterval ?? "")
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
              Additional settings
            </AccordionSummary>
            <AccordionDetails sx={{ marginInline: "20px 0" }}>
              <FormGroup>
                {/* Show Image Paths */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showImagePath}
                      onChange={toggleShowImagePath}
                    />
                  }
                  label="Show image path"
                />

                {/* Show Immersive Background */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showImmersiveBackground}
                      onChange={toggleShowImmersiveBackground}
                    />
                  }
                  label="Immersive background"
                />

                {/* Sellect session limit */}
                <Box>
                  <p>Number of images</p>
                  <AutoButtonGroup
                    choices={[
                      { name: "No Limit", value: 0 },
                      { name: "5", value: 5 },
                      { name: "10", value: 10 },
                      { name: "15", value: 15 },
                      { name: "20", value: 20 },
                      { name: "40", value: 40 },
                    ]}
                    selected={sessionCount}
                    onSelect={handleSessionCountChange}
                  />
                  <Input
                    size="small"
                    onChange={(e) => {
                      const value = e.target.value || "";
                      if (!value) return handleSessionCountChange(0);
                      const sessionCount = +value.replace("-", "");
                      !isNaN(sessionCount) &&
                        sessionCount > 0 &&
                        handleSessionCountChange(sessionCount);
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
                  <p
                    style={{
                      color: "gray",
                      visibility:
                        props.selectedInterval != null &&
                        props.selectedInterval !== Infinity &&
                        props.selectedInterval > 0 &&
                        sessionCount > 0
                          ? "visible"
                          : "hidden",
                    }}
                  >
                    Session time: ~
                    {Math.ceil((props.selectedInterval * sessionCount) / 60)}{" "}
                    min
                  </p>
                </Box>

                {/* Contrast multiplier */}
                <p>Contrast multiplier</p>
                <Box px={1}>
                  <Slider
                    aria-label="Contrast multiplier"
                    defaultValue={contrastMultiplier}
                    getAriaValueText={formatContrastMultiplierText}
                    valueLabelFormat={formatContrastMultiplierText}
                    step={0.05}
                    marks
                    min={1}
                    max={1.3}
                    valueLabelDisplay="auto"
                    onChange={changeContrastMultiplier}
                  />
                </Box>
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </Box>
      </div>
      <div>
        <Button
          variant="contained"
          className="wide"
          onClick={() => props.start(true, sessionCount)}
        >
          Start
        </Button>
      </div>
    </div>
  );
}
