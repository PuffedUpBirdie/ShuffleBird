import { Button, ButtonGroup as MuiButtonGroup } from "@mui/material";

type NamedValue<T> = {
  name: string;
  value: T;
};

type Choice<T> = T | NamedValue<T>;

type Props<T extends number | string> = {
  choices: Array<Choice<T>>;
  selected: T;
  onSelect: (selected: T) => void;
};

function isNamedValue<T>(value: any): value is NamedValue<T> {
  return value && typeof value.name === "string" && value.value !== undefined;
}

export const AutoButtonGroup = <T extends number | string>({
  choices,
  selected,
  onSelect,
}: Props<T>) => (
  <MuiButtonGroup
    variant="contained"
    aria-label="outlined primary button group"
  >
    {choices.map((value) => {
      const resolvedValue = isNamedValue(value) ? value.value : value;
      const name = isNamedValue(value) ? value.name : value;
      return (
        <Button
          key={resolvedValue.toString()}
          color={selected === resolvedValue ? "info" : undefined}
          onClick={() => {
            onSelect(resolvedValue);
          }}
          sx={{ textTransform: "none" }}
        >
          {name.toString()}
        </Button>
      );
    })}
  </MuiButtonGroup>
);
