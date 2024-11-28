import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";
import KUser from "../types/user";
import { useParams } from "react-router-dom";
import { Board } from "../types/board";
import { Button, Modal } from "@mui/material";
import KAutoComplete from "./KAutoComplete";

export default function Navbar(props: Props) {
  const [user, setUser] = useState<KUser>();
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      let userIdToSet = JSON.parse(userId);
      props.setNewUserId(userIdToSet);
      const userToSet = props.users.find((user) => user.id === userIdToSet);
      setUser(userToSet);
    }
  }, [id]);

  const onPickUsername = (user: KUser) => {
    if (user) {
      console.log(user);
      localStorage.setItem("userId", JSON.stringify(user.id));
      setUser(user);
      props.setNewUserId(user.id);
    }
  };
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            className="whitespace-nowrap"
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {props.boardName && props.boardName}
          </Typography>

          {props.users && (
            <React.Fragment>
              <Button onClick={handleOpen} color="inherit">
                {user ? user.name : "הכנס"}
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
                    <KAutoComplete
                      options={props.users}
                      onPickUsername={onPickUsername}
                    />
                    <Button onClick={handleClose} variant="contained">
                      אישור
                    </Button>
                  </div>
                </Box>
              </Modal>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
Navbar.defaultProps = {
  setNewUserId: () => {},
  users: [],
  boardName: "",
};

interface Props {
  setNewUserId: Function;
  users: KUser[];
  boardName: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "",
  boxShadow: 24,
  p: 6,
};
