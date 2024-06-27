import { useEffect, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import GoogleAuth from "./GoogleAuth";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "..";
import { Board } from "../types/board";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Alert, Box, Button, Modal, Snackbar, TextField } from "@mui/material";
import { postCollectionCoustumId, updateBoard } from "../service/serviceBoard";
function Kdashboard(props: Props) {
  const [connectedUser, setConnectedUser] = useState<User>();
  const [boards, setBoards] = useState<Board[]>();
  const [newBoard, setNewBoard] = useState<Board>({
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
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>();

  const auth = getAuth();

  useEffect(() => {
    async function getBoards() {
      let newBoards = await getCollectionByName("boards");
    }
    getBoards();
    onAuthStateChanged(auth, (user) => {
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
    await updateBoard(id, boardToUpdate);
  };
  // DATA
  const thTable = ["שם", "id", "קישור ללוח", "קישור לעריכה", "פעולות"];
  let board: Board = {
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
    mapBackgroundImage: "",
    timesToShow: [],
    users: [],
    theme: "column",
    isSetShabatTime: { isActive: false, enter: "", exit: "" },
    screens: [],
    backgroundToWhatsappImg: "background-frame5",
    isFreez: false,
  };
  interface FieldToNewBoard {
    key: keyof Board;
    text: "שם" | "id" | "מיקום";
  }
  const fieldsToNewBoard: FieldToNewBoard[] = [
    { key: "boardName", text: "שם" },
    { key: "id", text: "id" },
    { key: "geoId", text: "מיקום" },
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

        <Button onClick={() => setIsModalOpen(true)} variant="contained">
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
                    <TableCell align="right">
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
          {fieldsToNewBoard.map((filed) => {
            return (
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
            );
          })}
          <Button onClick={onPostNewBoard} variant="contained">
            הוסף
          </Button>
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
