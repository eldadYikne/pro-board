import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Kmodal from "./Kmodal";
import { useState, useEffect } from "react";
import axios from "axios";
import User from "../types/user";

export default function ButtonAppBar() {
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>();

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
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }
  };
  const getUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/users");
      console.log("getParasha", "data", data);
      setUsers(data);
    } catch (err) {}
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
          >
            <MenuIcon />
          </IconButton>
          <Typography
            className="whitespace-nowrap"
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            בית כנסת כלניות
          </Typography>

          {users && (
            <Kmodal onPickUsername={onPickUsername} users={users} user={user} />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
