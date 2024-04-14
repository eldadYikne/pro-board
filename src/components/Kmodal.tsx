import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import OutoComplete from "./OutoComplete";
import User from "../types/user";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",

  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Kmodal(props: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    props.setUsersAgain();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <div className="flex items-center justify-center" dir="rtl">
      <Button onClick={handleOpen} color="inherit">
        {props.user ? props.user.name : "הכנס"}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="w-full h-full flex flex-col gap-3">
            <span className="text-center">בחר שם מהרשימה</span>

            <OutoComplete
              options={props.users}
              onPickUsername={props.onPickUsername}
            />
            <Button onClick={handleClose} variant="contained">
              אישור
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
Kmodal.defaultProps = {
  users: [],
  onPickUsername: () => {},
  setUsersAgain: () => {},
  user: undefined,
};

interface Props {
  onPickUsername: Function;
  setUsersAgain: Function;
  users: User[];
  user: User | undefined;
}
