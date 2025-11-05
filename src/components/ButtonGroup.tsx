import { Button, ButtonGroup as MuiButtonGroup } from "@mui/material";

type NamedValue<T> = {
  name: string;
  value: T;
};

type Props<T extends number | string> = {
  choices: Array<NamedValue<T>>;
  selected: T;
  onSelect: (selected: T) => void;
};

export const AutoButtonGroup = <T extends number | string>({
  choices,
  selected,
  onSelect,
}: Props<T>) => (
  <MuiButtonGroup
    variant="contained"
    aria-label="outlined primary button group"
  >
    {choices.map((namedValue) => {
      const value = namedValue.value;
      const name = namedValue.name;
      return (
        <Button
          key={value}
          color={selected === value ? "info" : undefined}
          onClick={() => {
            onSelect(value);
          }}
          sx={{ textTransform: "none" }}
        >
          {name}
        </Button>
      );
    })}
  </MuiButtonGroup>
);
