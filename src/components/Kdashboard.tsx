import { useEffect, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import GoogleAuth from "./GoogleAuth";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "..";
import { Board } from "../types/board";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { Delete, Cancel } from "@mui/icons-material";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Alert, Box, Button, Modal, Snackbar, TextField } from "@mui/material";
import { postCollectionCoustumId, updateBoard } from "../service/serviceBoard";
function Kdashboard(props: Props) {
  const [connectedUser, setConnectedUser] = useState<User>();
  const [boards, setBoards] = useState<Board[]>();
  const boardObj: Board = {
    id: "",
    boardName: "",
    geoId: "",
    timeScreenPass: "20",
    dateTypes: ["hebrew"],
    tfilaTimes: [],
    forUplifting: [],
    forMedicine: [],
    messages: [],
    boardBackgroundImage: "1",
    boardTextColor: "",
    mapBackgroundImage: "1",
    timesToShow: [],
    users: [],
    theme: "column",
    isSetShabatTime: { isActive: false, enter: "", exit: "" },
    screens: [],
    backgroundToWhatsappImg: "background-frame5",
    isFreez: false,
    admins: [],
  };
  const [newBoard, setNewBoard] = useState<Board>(boardObj);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>();

  const auth = getAuth();

  useEffect(() => {
    async function getBoards() {
      let newBoards = await getCollectionByName("boards");
    }
    getBoards();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("connected user", user);
        setConnectedUser(user);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
    return unsubscribe;
  }, [connectedUser?.email]);

  const getCollectionByName = (collectionName: string) => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (querySnapshot) => {
        const news = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(collectionName, news);
        if (connectedUser?.email === "nmknv99@gmail.com") {
          setBoards(news as Board[]);
        }
        // Optionally, you can do something with the 'news' array here
      },
      (error) => {
        console.error("Error fetching collection:", error);
      }
    );

    // Return the unsubscribe function to stop listening to updates
    return unsubscribe;
  };

  const onPostNewBoard = async () => {
    try {
      if (newBoard.id) {
        await postCollectionCoustumId("boards", newBoard, newBoard.id);
        setSnackbarIsOpen(true);
        setTimeout(() => setSnackbarIsOpen(false), 2000);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onUpdateBoard = async (id: string, boardToUpdate: Board) => {
    try {
      await updateBoard(id, boardToUpdate);
      setSnackbarIsOpen(true);
      setTimeout(() => setSnackbarIsOpen(false), 2000);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };
  const onChangeAdminsInput = (email: string, idx: number) => {
    const newAdmins = newBoard.admins;
    newAdmins.splice(idx, 1, email);
    setNewBoard({
      ...newBoard,
      admins: newAdmins,
    });
  };
  const onDeleteAdminsInput = (idx: number) => {
    const newAdmins = newBoard.admins;
    newAdmins.splice(idx, 1);
    setNewBoard({
      ...newBoard,
      admins: newAdmins,
    });
  };
  // DATA
  const thTable = ["שם", "id", "קישור ללוח", "קישור לעריכה", "פעולות"];

  interface FieldToNewBoard {
    key: keyof Board;
    text: "שם" | "id" | "מיקום" | "בעלי הרשאות";
  }
  const fieldsToNewBoard: FieldToNewBoard[] = [
    { key: "boardName", text: "שם" },
    { key: "id", text: "id" },
    { key: "geoId", text: "מיקום" },
    { key: "admins", text: "בעלי הרשאות" },
  ];
  if (!connectedUser || connectedUser?.email !== "nmknv99@gmail.com") {
    return (
      <div className="flex flex-col w-full h-screen justify-center items-center">
        <div className="p-4 border-purple-700 border-2 rounded-lg flex flex-col items-center">
          {connectedUser?.email &&
            connectedUser?.email !== "nmknv99@gmail.com" && (
              <div>אין לך גישה לעמוד זה</div>
            )}
          <GoogleAuth
            setUser={setConnectedUser}
            userConnected={connectedUser?.email ?? ""}
          />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex gap-3 w-full p-2 items-center bg-slate-400">
        {connectedUser && <div> {connectedUser.displayName}</div>}
        <GoogleAuth
          setUser={setConnectedUser}
          userConnected={connectedUser?.email ?? ""}
        />
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setNewBoard(boardObj);
          }}
          variant="contained"
        >
          {" "}
          הוספת לוח +
        </Button>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {thTable.map((th) => {
                  return (
                    <TableCell sx={{ fontWeight: 800 }} align="right">
                      {th}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {boards &&
                boards.map((row: Board) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right" component="th" scope="row">
                      {row.boardName}
                    </TableCell>
                    <TableCell align="right">{row.id}</TableCell>
                    <TableCell align="right">
                      {" "}
                      <a
                        className="text-blue-500"
                        href={`https://kodesh-board.onrender.com/board/${row.id}`}
                      >
                        לוח
                      </a>
                    </TableCell>
                    <TableCell align="right">
                      <a
                        className="text-blue-500"
                        href={`https://kodesh-board.onrender.com/edit/${row.id}`}
                      >
                        עריכה
                      </a>
                    </TableCell>
                    <TableCell sx={{ display: "flex", gap: 2 }} align="right">
                      <Button
                        onClick={() =>
                          onUpdateBoard(row.id ?? "", {
                            ...row,
                            isFreez: !row.isFreez,
                          })
                        }
                        variant="contained"
                        color={row.isFreez ? "error" : "primary"}
                      >
                        {row.isFreez ? "שחרר" : "הקפאה"}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsModalOpen(true);
                          setNewBoard(row);
                        }}
                        variant="contained"
                        color="primary"
                      >
                        ערוך לוח
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal
        sx={{ overflowY: "scroll", overflowX: "hidden" }}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col justify-center items-center gap-1">
            <span className="text-lg  font-bold">
              {newBoard.id ? "ערוך לוח" : "יצירת לוח חדש"}
            </span>
            {fieldsToNewBoard.map((filed) => {
              return filed.key === "admins" ? (
                <div className="flex flex-col gap-1">
                  <span className="text-center"> : בעלי הרשאות </span>
                  {newBoard.admins.length > 0 &&
                    newBoard.admins?.map((admin, idx) => {
                      return (
                        <div className="flex gap-1 items-center justify-center">
                          <Delete
                            className="cursor-pointer"
                            color="error"
                            onClick={() => onDeleteAdminsInput(idx)}
                          />
                          <TextField
                            dir="rtl"
                            id="filled-basic"
                            label={filed.text}
                            value={newBoard.admins[idx]}
                            onChange={(e) =>
                              onChangeAdminsInput(e.target.value, idx)
                            }
                            variant="filled"
                          />
                        </div>
                      );
                    })}
                  <Button
                    className="m-2"
                    onClick={() =>
                      setNewBoard({
                        ...newBoard,
                        [filed.key]: [...newBoard.admins, ""],
                      })
                    }
                    variant="contained"
                  >
                    הוסף מייל להרשאה
                  </Button>
                </div>
              ) : (
                <div>
                  <TextField
                    dir="rtl"
                    id="filled-basic"
                    label={filed.text}
                    value={newBoard[filed.key as keyof Board]}
                    onChange={(e) =>
                      setNewBoard({ ...newBoard, [filed.key]: e.target.value })
                    }
                    variant="filled"
                  />
                </div>
              );
            })}
            <Button
              onClick={() => {
                newBoard.id
                  ? onUpdateBoard(newBoard.id ?? "", {
                      ...newBoard,
                    })
                  : onPostNewBoard();
              }}
              variant="contained"
            >
              {newBoard.id ? "אישור" : " צור לוח"}
            </Button>
          </div>
        </Box>
      </Modal>
      <Snackbar
        className="flex flex-row-reverse"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarIsOpen}
        dir="rtl"
        key={"bottom" + "center"}
      >
        <Alert
          onClose={() => setSnackbarIsOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          הלוח עודכן בהצלחה!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Kdashboard;
Kdashboard.defaultProps = {};

interface Props {}

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
