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
  start: (sessionLimitEnabled: boolean, sessionImageCount: number) => void;
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
  const settings = getSettings();
  const [showImagePath, setShowImagePath] = useState<boolean>(
    settings.showImagePath
  );
  const [sessionCount, setSessionCount] = useState(0);

  const handleChangeImagePath = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const showImagePath = event.target.checked;
    const settings = getSettings();
    setSettings({ ...settings, showImagePath });
    setShowImagePath(showImagePath);
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
                : props.selected_interval ?? ""
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
      <p>Select Session count</p>
      <div>
        <AutoButtonGroup
          choices={[{ name: "No Limit", value: 0 }, 5, 10, 15, 20, 40]}
          selected={sessionCount}
          onSelect={handleSessionCountChange}
        />
        <Input
          size="small"
          onChange={(e) => {
            const value = e.target.value || "";
            if (!value) return handleSessionCountChange(0);
            const _sessionCount = +value.replace("-", "");
            !isNaN(_sessionCount) &&
              _sessionCount > 0 &&
              handleSessionCountChange(_sessionCount);
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
        {(() => {
          const validSession =
            props.selected_interval != null &&
            props.selected_interval !== Infinity &&
            props.selected_interval > 0 &&
            sessionCount > 0;
          return (
            <p
              style={{
                color: "gray",
                visibility: validSession ? "visible" : "hidden",
              }}
            >
              session time: ~
              {validSession
                ? Math.ceil((props.selected_interval * sessionCount) / 60)
                : 0}{" "}
              min
            </p>
          );
        })()}
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
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </Box>
      </div>
      <div>
        <Button
          variant="contained"
          className="wide"
          onClick={() => {
            const validSession =
              props.selected_interval != null &&
              props.selected_interval !== Infinity &&
              props.selected_interval > 0 &&
              sessionCount > 0;
            props.start(validSession, sessionCount);
          }}
        >
          Start
        </Button>
      </div>
    </div>
  );
}
