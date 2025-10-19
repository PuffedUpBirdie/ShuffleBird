import { Button, ButtonGroup as MuiButtonGroup } from "@mui/material";

type Props<T> = {
  choices: Array<T>;
  selected: T;
  onSelect: (selected: T) => void;
};

type NamedValue<T> = {
  name: string;
  value: T;
};

function isNamedValue<T>(value: any): value is NamedValue<T> {
  return value && typeof value.name === "string" && value.value !== undefined;
}

export const AutoButtonGroup = <T extends (number | string) | NamedValue<T>>({
  choices,
  selected,
  onSelect,
}: Props<T>) => (
  <MuiButtonGroup
    variant="contained"
    aria-label="outlined primary button group"
  >
    {choices.map((value) => {
      const _value = isNamedValue(value) ? value.value : value;
      const name = isNamedValue(value) ? value.name : value;
      return (
        <Button
          key={_value.toString()}
          color={selected === _value ? "info" : undefined}
          onClick={() => {
            onSelect(_value);
          }}
        >
          {name.toString()}
        </Button>
      );
    })}
  </MuiButtonGroup>
);
