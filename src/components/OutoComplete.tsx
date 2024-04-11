import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import User from "../types/user";
import { useState, useEffect } from "react";

export default function OutoComplete(props: Props) {
  const defaultProps = {
    options: props.options?.map((user: User) => ({ label: user.name })),
  };
  const onSetUser = (newValue: Option) => {
    if (newValue) {
      const userToSet = props.options.find(
        (user: User) => user.name === newValue.label
      );
      console.log("newValue", newValue);
      props.onPickUsername(userToSet);
    } else {
      props.onPickUsername(undefined);
    }
  };
  return (
    <div dir="rtl" className="">
      <Autocomplete
        {...defaultProps}
        id="clear-on-escape"
        className="w-full flex flex-row-reverse"
        clearOnEscape
        onChange={(event: any, newValue: any | null) => {
          onSetUser(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="שם" variant="standard" />
        )}
      />
    </div>
  );
}
OutoComplete.defaultProps = {
  options: [],
};
interface Option {
  label: string;
}
interface Props {
  options: User[];
  onPickUsername: Function;
  // options: Option[];
}
