import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import { PopoverOption } from "../types/popover";
import { Switch, dividerClasses } from "@mui/material";

export default function KPopover({
  buttonText,
  isOpen,
  options,
  setOptions,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  let optionsCopy = [...options];

  return (
    <div>
      {buttonText && (
        <Button aria-describedby={id} variant="contained" onClick={handleClick}>
          {buttonText}
        </Button>
      )}
      <Popover
        id={id}
        open={buttonText ? open : !!isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {options.map((option, idx) => {
          return (
            <div className="flex gap-2 items-center justify-between p-2">
              {option.type === "switch" && (
                <div>
                  <Switch
                    onChange={() => {
                      optionsCopy.splice(idx, 1, {
                        ...option,
                        value: !option.value,
                      });
                      setOptions(optionsCopy);
                      if (option.function) {
                        option.function({
                          ...option,
                          value: !option.value,
                        });
                      }
                    }}
                    checked={option.value}
                  />
                </div>
              )}{" "}
              {option.type === "button" && (
                <div>
                  <Button
                    aria-describedby={id}
                    variant="contained"
                    onClick={() => {
                      if (option.function) {
                        option.function();
                      }
                    }}
                  >
                    {option.label}
                  </Button>
                </div>
              )}
              <Typography sx={{ p: 2 }}>{option.label}</Typography>
            </div>
          );
        })}
      </Popover>
    </div>
  );
}
KPopover.defaultProps = {
  buttonText: "",
  isOpen: false,
  setOptions: () => {},
};
interface Props {
  buttonText?: string;
  isOpen?: boolean;
  iconButton?: "setting";
  options: PopoverOption[];
  setOptions: Function;
}
