import * as React from "react";
import Button from "@mui/material/Button";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

function MySnackBar(props: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar("I love snacks.");
  };

  const handleClickVariant = (variant: VariantType) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("This is a success message!", { variant: props.variante });
  };

  return (
    <React.Fragment>
      <Button onClick={handleClick}>Show snackbar</Button>
      <Button onClick={handleClickVariant("success")}>
        Show success snackbar
      </Button>
    </React.Fragment>
  );
}

export default function SnackbarPop(props: Props) {
  return (
    <SnackbarProvider maxSnack={3}>
      <MySnackBar message={props.message} variante={props.variante} />
    </SnackbarProvider>
  );
}

SnackbarPop.defaultProps = {
  message: "",
  variante: "success",
};
MySnackBar.defaultProps = {
  message: "",
  variante: "success",
};

interface Props {
  message: string;
  variante: "default" | "error" | "success" | "warning" | "info" | undefined;
}
