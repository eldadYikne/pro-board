import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Kmodal from "./Kmodal";
import { useState, useEffect } from "react";
import User from "../types/user";
import { collection, getDocs } from "firebase/firestore";
import { db } from "..";

export default function Navbar(props: Props) {
  const [user, setUser] = useState<any>();
  const [users, setUsers] = useState<any[]>();

  useEffect(() => {
    async function fetchData() {
      await getUsers();
    }
    fetchData();
    const user = localStorage.getItem("user");

    if (user) {
      let userToSet = JSON.parse(user);
      setUser(userToSet);
    }
  }, []);

  const onPickUsername = (user: User) => {
    if (user) {
      console.log(user);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      props.setNewUser(user);
    }
  };
  const getUsers = async () => {
    await getDocs(collection(db, "users"))
      .then((shot) => {
        const news = shot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setUsers(news);
        console.log("news", news);
      })
      .catch((error) => console.log(error));
  };
  const setUsersAgain = async () => {
    await getUsers();
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>
          <Typography
            className="whitespace-nowrap"
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            בית כנסת כלניות
          </Typography>

          {users && (
            <Kmodal
              onPickUsername={onPickUsername}
              setUsersAgain={setUsersAgain}
              users={users}
              user={user}
            />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
Navbar.defaultProps = {
  setNewUser: () => {},
};

interface Props {
  setNewUser: Function;
}
