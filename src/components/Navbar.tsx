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
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "..";
import { useParams } from "react-router-dom";
import { Board } from "../types/board";

export default function Navbar(props: Props) {
  const [user, setUser] = useState<any>();
  const [users, setUsers] = useState<any[]>();
  const [dbBoard, setDbBoard] = useState<Board>();

  const { id } = useParams();
  useEffect(() => {
    async function fetchData() {
      console.log("id from navbar", id);
      if (id) {
        console.log("id from navbar", id);
        await getBoardById(id);
      }
      await getUsers();
    }

    fetchData();
    const user = localStorage.getItem("user");

    if (user) {
      let userToSet = JSON.parse(user);
      props.setNewUser(userToSet);
      setUser(userToSet);
    }
  }, [id]);
  const getBoardById = async (boardId: string) => {
    try {
      const boardDoc = await getDoc(doc(db, "boards", boardId));
      if (boardDoc.exists()) {
        // Document exists, return its data along with the ID
        const newBoard = { ...boardDoc.data(), id: boardDoc.id };
        if (newBoard) {
          setDbBoard(newBoard as Board);
        }
        console.log(newBoard);
      } else {
        // Document does not exist
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };
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
        const news: any[] = shot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // news.sort((a,b)=>)
        const sortedArray = news.sort((a, b) => {
          const nameA = a.name;
          const nameB = b.name;
          // Use localeCompare with 'he' locale to compare Hebrew characters
          return nameA.localeCompare(nameB, "he");
        });
        setUsers(sortedArray);
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
            {dbBoard && dbBoard.boardName}
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
