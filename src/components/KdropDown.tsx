import * as React from "react";
import { styled } from "@mui/system";
import {
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { KdropDownOption } from "../types/dropDown";
export default function KdropDown(props: Props) {
  const [currentItem, setCurrentItem] = React.useState<KdropDownOption>(
    props.options[0]
  );

  const createHandleMenuClick = (menuItem: KdropDownOption) => {
    setCurrentItem(menuItem);
    props.setItem(menuItem);
  };

  return props.options.length > 0 ? (
    <Select
      className="kdropdown"
      value={currentItem.text}
      onChange={(event) => {
        const selectedOption = props.options.find(
          (option) => option.text === event.target.value
        );
        if (selectedOption) {
          createHandleMenuClick(selectedOption);
        }
      }}
    >
      {props.options.map((option, idx) => (
        <MenuItem key={idx} value={option.text}>
          {option.text}
        </MenuItem>
      ))}
    </Select>
  ) : (
    <div>No options</div>
  );
}
const Select = React.forwardRef(function CustomSelect(
  props: MuiSelectProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { slots, ...other } = props;

  const StyledButton = styled("div")({
    // Your styling here
  });

  return (
    <div className="w-full">
      <MuiSelect {...props} ref={ref} />
    </div>
  );
});

KdropDown.defaultProps = {
  options: [],
  setItem: () => {},
};

interface Props {
  options: KdropDownOption[];
  setItem: Function;
}
