import { useState, useEffect } from "react";
import KUser from "../types/user";
import "firebase/compat/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "..";
import * as React from "react";
import Kboard from "./Kboard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import PayBox from "../assets/paybox.png";
import Img1 from "../assets/img1.jpg";
import {
  Alert,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Zman } from "../types/zmanim";
import EditBoard from "./EditBoard";
import { useParams } from "react-router-dom";
import { Board, Message, ShabatTimesToEdit, Tfila } from "../types/board";
import { getCurrentDateDayFirstByGetDate } from "../utils/const";
import { ReactComponent as Decorative1 } from "../assets/decorative-1.svg";
import Navbar from "./Navbar";
import { updateUser } from "../service/serviceUser";
import { Background } from "@cloudinary/url-gen/qualifiers";

function ConfirmedPlace(props: Props) {
  const [user, setUser] = useState<KUser>();
  const [checked, setChecked] = useState(false);
  const [users, setUsers] = useState<KUser[]>();
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>();
  const [dbBoard, setDbBoard] = useState<Board>();
  const [userToEdit, setUserToEdit] = useState<KUser>();

  const label = {
    inputProps: { "aria-label": "Switch demo" },
    label: checked ? "נמצא" : "לא נמצא",
  };
  const { id } = useParams();

  useEffect(() => {
    console.log("board id", id);
    if (user?.name) {
      // let userToSet = JSON.parse(user);
      setUser(user);
      setChecked(user?.present);
    }
    async function fetchData() {
      if (id) {
        console.log("id", id);
        await getBoardByIdSnap(id);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (user?.name) {
      // let userToSet = JSON.parse(user);
      setUser(user);
      setChecked(user?.present);
    }
  }, [user]);
  const getBoardByIdSnap = async (boardId: string) => {
    try {
      const boardRef = doc(db, "boards", boardId);
      const boardDataArray: any = []; // Array to store board data

      // Listen to changes in the board document
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        if (boardDoc.exists()) {
          // Document exists, push its data into the array along with the ID
          const newBoard: Board = {
            ...(boardDoc.data() as Board),
            id: boardDoc.id,
          };
          boardDataArray.push(newBoard);
          if (newBoard.id) {
            setDbBoard(newBoard as Board);
          }
          console.log("user", user);
          if (user && newBoard?.users && newBoard?.users.length > 0) {
            const updateUser = newBoard?.users.find(
              (newUser) => newUser.id === user.id
            );
            if (updateUser) {
              setUser(updateUser);
              localStorage.setItem("user", JSON.stringify(user));
              console.log("updatedUser", updateUser);
            }
          }
          console.log(newBoard);
        } else {
          // Document does not exist
          console.log("Board not found");
        }
      });

      // Return the array and the unsubscribe function
      return { boardDataArray, unsubscribe };
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };
  const onMarkDebtAsPaid = async (debtIdx: number) => {
    if (user?.debts && user?.debts.length > 0) {
      const newDebts = user?.debts;
      const newDebtToEdit = user?.debts[debtIdx];
      newDebtToEdit.isPaid = !newDebtToEdit.isPaid;
      newDebts.splice(debtIdx, 1, newDebtToEdit);

      setUserToEdit({
        ...user,
        debts: newDebts,
      });
      const newUserToEdit = { ...user, debts: [...newDebts] };
      try {
        if (id) {
          await updateUser(id, newUserToEdit);
          setSnackbarIsOpen(true);
          setTimeout(() => setSnackbarIsOpen(false), 2000);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleChange = async (isPresent: boolean) => {
    setChecked(isPresent);
    if (user) {
      try {
        let newUser: KUser = {
          ...user,
          present: !checked,
        };
        if (newUser?.name) {
          localStorage.setItem("user", JSON.stringify(newUser));
          setUser(newUser);

          await updateNewUser(newUser?.id!, newUser);
          setSnackbarIsOpen(true);
          setTimeout(() => setSnackbarIsOpen(false), 2000);
        }
      } catch (err) {
        console.log(err);
      }
      console.log(isPresent);
    }
  };

  const updateNewUser = async (userId: string, userData: KUser) => {
    if (id && user) {
      await updateUser(id, userData);
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
  const shabatTimesToEdit: ShabatTimesToEdit[] = [
    { type: "weekday", name: "יום חול" },
    { type: "friday", name: " ערב שבת" },
    { type: "saturday", name: " שבת" },
  ];
  const thTable = ["עבור", "סכום", "תאריך", "שולם"];

  if (!dbBoard) {
    return <div></div>;
  }
  return (
    <div className="flex flex-col pb-8 justify-center items-center w-full gap-3 ">
      <Navbar users={dbBoard?.users} setNewUser={setUser} />
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
          {user?.name && (
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

      {dbBoard && (
        <Card
          sx={{
            width: 345,
            backgroundColor: "#f7e4c7f7",
            border: "9px #4c5676 double",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardContent>
            <div className="w-full flex justify-center text-xl font-bold">
              זמני תפילות
            </div>
            {shabatTimesToEdit.map((time, idx) => {
              return (
                <div key={idx} className="flex flex-col gap-1 w-full text-base">
                  <div className="underline w-full font-bold">{time.name}</div>
                  {dbBoard.tfilaTimes.map((tfila: Tfila, idx) => {
                    return (
                      time.type === tfila.day && (
                        <div key={idx} className="flex w-full flex-col">
                          <div className="flex w-full justify-between gap-1">
                            <span>{tfila.name}:</span>
                            <span>{tfila.time} </span>
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
      {dbBoard && dbBoard.messages.length > 0 && (
        <Card
          sx={{
            width: 345,
            backgroundColor: "#f7e4c7f7",
            border: "9px #4c5676 double",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardContent>
            <div className="w-full flex justify-center font-bold text-xl">
              הודעות לציבור
            </div>
            <div className="flex flex-col gap-4 text-base">
              {dbBoard.messages.map((message: Message, idx) => {
                return (
                  <div key={idx} className="flex flex-col">
                    {/* <span>{String(message.date)}:</span> */}
                    <span>-{message.content} </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      {user && user?.debts.length > 0 && (
        <div className=" w-full flex flex-col gap-1 px-4">
          <Table
            align="right"
            style={{
              tableLayout: "auto",
              border: "1px solid gray",
              width: "100%",
            }}
          >
            <TableHead>
              <TableRow className="bg-[#f7e4c7f7]">
                {thTable.map((th, idx) => {
                  return (
                    <TableCell
                      key={idx}
                      className="table-cell-mobile"
                      sx={{ fontWeight: 800 }}
                      align="right"
                    >
                      {th}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {user?.debts.length > 0 &&
                user?.debts.map((debt, debtidx: number) => {
                  return (
                    <TableRow
                      key={debtidx}
                      className="!bg-[#e3d8d854'] table-row"
                    >
                      <TableCell
                        size="small"
                        align="right"
                        component="th"
                        scope="row"
                      >
                        {debt.reason}
                      </TableCell>
                      <TableCell
                        size="small"
                        align="right"
                        component="th"
                        scope="row"
                      >
                        {debt.sum} ₪
                      </TableCell>
                      <TableCell
                        size="small"
                        align="right"
                        component="th"
                        scope="row"
                      >
                        {getCurrentDateDayFirstByGetDate(debt.date)}
                      </TableCell>

                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={() => onMarkDebtAsPaid(debtidx)}
                            defaultChecked
                            checked={debt.isPaid}
                            style={{ color: "green" }}
                          />
                        }
                        label=""
                      />
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          {dbBoard?.payboxLink && (
            <div className="flex w-full justify-center">
              <span className="flex gap-1 p-1 bg-[#039BE6] rounded-lg text-white">
                <a target="_blank" href={dbBoard?.payboxLink}>
                  <img
                    className=" w-24 "
                    src={
                      "https://www.payboxapp.com/wp-content/uploads/2020/04/site-logo-white.png"
                    }
                  />
                </a>
              </span>
            </div>
          )}
        </div>
      )}
      {user &&
        user?.debts?.length > 0 &&
        user?.debts?.find((debt) => !debt.isPaid) && (
          <div className="w-full fixed bg-[#e75757] text-white font-medium text-xl font-serif bottom-0 flex h-8 px-1 z-10   justify-center gap-2 items-center ">
            הוועד מזכיר לך לשלם על נדר שלא שולם
          </div>
        )}
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
  havdalah: "",
  candles: "",
  parasha: "",
  zmanim: null,
};

interface Props {
  havdalah: string;
  candles: string;
  parasha: string;
  zmanim: Zman[] | null;
}
