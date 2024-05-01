import { useState, useEffect } from "react";
import User from "../types/user";
import Switch from "@mui/material/Switch";
import "firebase/compat/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "..";
import * as React from "react";
import Kboard from "./Kboard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Img1 from "../assets/img1.jpg";
import { Alert, Checkbox, FormControlLabel, Snackbar } from "@mui/material";
import { Zman } from "../types/zmanim";
import EditBoard from "./EditBoard";
import { useParams } from "react-router-dom";
import { Board } from "../types/board";

function ConfirmedPlace(props: Props) {
  const [user, setUser] = useState<User>();
  const [checked, setChecked] = useState(!!props.user.present);
  const [users, setUsers] = useState<User[]>();
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>();
  const [dbBoard, setDbBoard] = useState<Board>();

  const label = {
    inputProps: { "aria-label": "Switch demo" },
    label: checked ? "נמצא" : "לא נמצא",
  };
  const { id } = useParams();

  useEffect(() => {
    console.log("board id", id);
    if (props.user.name) {
      // let userToSet = JSON.parse(user);
      setUser(props.user);
      setChecked(props.user.present);
    }
    async function fetchData() {
      if (id) {
        console.log("id", id);
        await getBoardById(id);
      }
    }
    fetchData();
  }, [props.user]);
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
  const handleChange = async (isPresent: boolean) => {
    setChecked(isPresent);
    const newUserToUse: any = props.user;
    console.log("newUserToUse", newUserToUse);
    if (!user?.id) {
      const userWithId = users?.find(
        (currUser) => user?.name === currUser.name
      );
      if (userWithId) {
        setUser(userWithId);
      }
    }
    try {
      let newUser: any = {
        id: newUserToUse?.id,
        seats: newUserToUse?.seats,
        name: newUserToUse?.name ?? "",
        present: !checked,
      };
      if (newUser?.name) {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        await updateUser(newUser?.id!, {
          name: newUser?.name,
          present: !checked,
        });
        setSnackbarIsOpen(true);
        setTimeout(() => setSnackbarIsOpen(false), 2000);
      }
    } catch (err) {
      console.log(err);
    }
    console.log(isPresent);
  };
  const updateUser = async (userId: string, userData: any) => {
    const userRef = doc(collection(db, "users"), userId); // Get reference to the user document

    try {
      await updateDoc(userRef, userData); // Update the user document with new data
      console.log("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarIsOpen(false);
  };
  return (
    <div className="flex flex-col justify-center items-center w-full p-2">
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={Img1}
          alt="green iguana"
        />

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <span>נוכחות - {props.parasha}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <div className="text-sm w-36">
              <div className="flex justify-between">
                הדלקת נרות : <span>{props.candles}</span>
              </div>
              <div className="flex justify-between">
                הבדלה : <span>{props.havdalah}</span>
              </div>
            </div>
          </Typography>
          {props.user.name && (
            <div className="text-black  transition-all flex items-center justify-center">
              {/* {checked ? "נמצא" : "לא נמצא"} */}
              {/* <Switch
                {...label}
                defaultChecked
                checked={checked}
                onChange={handleChange}
              /> */}
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleChange(true)}
                    defaultChecked
                    checked={checked}
                  />
                }
                label="נמצא"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleChange(false)}
                    defaultChecked
                    checked={!checked}
                  />
                }
                label="לא נמצא"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* <div className="w-full h-full ">
        <Board zmanim={props.zmanim} />
      </div> */}
      {/* {<EditBoard />} */}
      <div>
        <Snackbar
          className="flex flex-row-reverse"
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarIsOpen}
          dir="rtl"
          key={"bottom" + "center"}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            הפעולה בוצעה בהצלחה{" "}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default ConfirmedPlace;
ConfirmedPlace.defaultProps = {
  user: {},
  havdalah: "",
  candles: "",
  parasha: "",
  zmanim: null,
};

interface Props {
  user: User;
  havdalah: string;
  candles: string;
  parasha: string;
  zmanim: Zman[] | null;
}
