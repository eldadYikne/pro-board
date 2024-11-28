import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import KUser from "../types/user";
import { useState, useEffect } from "react";

export default function KAutoComplete(props: Props) {
  const defaultProps = {
    options: props.options?.map((user: KUser) => ({ label: user.name })),
  };
  const onSetUser = (newValue: Option) => {
    if (newValue) {
      const userToSet = props.options.find(
        (user: KUser) => user.name === newValue.label
      );
      console.log("newValue", newValue);
      props.onPickUsername(userToSet);
    } else {
      props.onPickUsername(undefined);
    }
  };
  return (
    <div className="">
      <Autocomplete
        dir="rtl"
        {...defaultProps}
        id="clear-on-escape"
        className="w-full flex flex-row-reverse"
        clearOnEscape
        onChange={(event: any, newValue: any | null) => {
          onSetUser(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} dir="rtl" label="שם" variant="standard" />
        )}
      />
    </div>
  );
}
KAutoComplete.defaultProps = {
  options: [],
};
interface Option {
  label: string;
}
interface Props {
  options: KUser[];
  onPickUsername: Function;
}
