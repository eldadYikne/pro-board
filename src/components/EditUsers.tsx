import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Board } from "../types/board";
import { db } from "..";
import User, { Debt, DebtReason, SeatUser } from "../types/user";
import {
  Box,
  Button,
  Collapse,
  ListItemText,
  Modal,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { ExpandLess, ExpandMore, Payment } from "@mui/icons-material";
import { updateBoard } from "../service/serviceBoard";
import { Delete, Cancel } from "@mui/icons-material";
import TableRow from "@mui/material/TableRow";
import { getCurrentDate } from "../utils/utils";
import { getCurrentDateDayFirstByGetDate } from "../utils/const";
import KdropDown from "./KdropDown";
import { KdropDownOption } from "../types/dropDown";
function EditUsers(props: Props) {
  const { id } = useParams();
  const [dbBoard, setDbBoard] = useState<Board>();
  const [userToEdit, setUserToEdit] = useState<User>();
  const [openCollapseUser, setOpenCollapseUser] = useState<User | undefined>(
    undefined
  );
  const [newDebt, setNewDebt] = useState<Debt>();
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>();

  useEffect(() => {
    async function fetchData() {
      if (id) {
        console.log("id", id);
        await getBoardByIdSnap(id);
      }
    }
    fetchData();
  }, [id]);

  const getBoardByIdSnap = async (boardId: string) => {
    try {
      const boardRef = doc(db, "boards", boardId);

      // Listen to changes in the board document
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        if (boardDoc.exists()) {
          // Document exists, return its data along with the ID
          const newBoard = { ...boardDoc.data(), id: boardDoc.id };
          if (newBoard) {
            setDbBoard(newBoard as Board);
          }
          console.log(newBoard);
        } else {
          // Document does not exist
          console.log("Board not found");
          // setDbBoard(null); // or however you handle this case in your application
        }
      });

      // Return the unsubscribe function to stop listening when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };

  const debtInput: {
    key: keyof Debt;
    text: string;
    type: "number" | "text" | "date";
    options?: KdropDownOption[];
  }[] = [
    {
      key: "reason",
      text: "עבור",
      type: "text",
      options: [
        { type: "", text: "עלייה לתורה" },
        { type: "", text: "תרומה" },
        { type: "", text: "לרפואה" },
        { type: "", text: "לעילוי נשמת" },
      ],
    },
    { key: "sum", text: "סכום", type: "number" },
    { key: "date", text: "תאריך", type: "date" },
  ];
  const thTable = ["שם", "מקומות", "חובות", "פעולות"];

  const onChangeUserToEdit = (debtKey: keyof Debt, idx: number) => {
    const newDebts = userToEdit?.debts ?? [];

    // newDebts.splice(idx, 1, email);
    // setUserToEdit({
    //   ...userToEdit,
    //   debts:newDebts
    //  })
  };
  const onChangeDebt = (debtKey: keyof Debt, value: number | string | Date) => {
    if (debtKey && newDebt) {
      setNewDebt({
        ...newDebt,
        [debtKey]: value,
      });
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
  const addDebt = async () => {
    let userIdx: number = NaN;
    if (dbBoard?.users && userToEdit) {
      const user: User | undefined = dbBoard?.users.find(
        (user: User, idx: number) => {
          if (user.id === userToEdit?.id) {
            userIdx = idx;
            return true;
          }
        }
      );
      // console.log("userIdx", userIdx);
      // console.log("user", user);
      // console.log("newDebt", newDebt);
      // console.log("dbBoard?.users", dbBoard?.users);

      if (userIdx && user && user.debts && newDebt) {
        const newDebts: Debt[] = [...user.debts, newDebt];

        if (newDebts) {
          setUserToEdit({
            ...userToEdit,
            debts: [...newDebts],
          });
        }
        console.log("userToEdit", userToEdit);
        const newUserToEdit = { ...userToEdit, debts: [...newDebts] };
        const newUsers = dbBoard.users;
        newUsers.splice(userIdx, 1, newUserToEdit);
        setDbBoard({
          ...dbBoard,
          users: newUsers,
        });
        setEditModalIsOpen(false);
        try {
          if (id) {
            await updateBoard(id, dbBoard);
            setSnackbarIsOpen(true);
            setTimeout(() => setSnackbarIsOpen(false), 2000);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };
  const removeDebt = async (debtIdx: number) => {
    const newDebts = openCollapseUser?.debts;
    let userIdx: number = NaN;
    console.log("openCollapseUser", openCollapseUser);

    if (dbBoard?.users && openCollapseUser) {
      const user: User | undefined = dbBoard?.users.find(
        (user: User, idx: number) => {
          if (user.id === openCollapseUser?.id) {
            userIdx = idx;
            return true;
          }
        }
      );
      console.log("userIdx", userIdx);
      console.log("user", user);
      console.log("newDebt", newDebts);
      console.log("dbBoard?.users", dbBoard?.users);
      if (userIdx && user && user.debts && newDebts) {
        if (newDebts) {
          newDebts.splice(debtIdx, 1);
          setUserToEdit({
            ...openCollapseUser,
            debts: newDebts,
          });

          const newUserToEdit = { ...openCollapseUser, debts: [...newDebts] };
          const newUsers = dbBoard.users;
          newUsers.splice(userIdx, 1, newUserToEdit);
          setDbBoard({
            ...dbBoard,
            users: newUsers,
          });
          try {
            if (id) {
              await updateBoard(id, dbBoard);
              setSnackbarIsOpen(true);
              setTimeout(() => setSnackbarIsOpen(false), 2000);
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  };
  return (
    <div>
      {dbBoard?.users && (
        <TableContainer
          component={Paper}
          className="mobile-only:!max-w-full !overflow-x-hidden sm:!overflow-x-auto"
        >
          <Table
            className="table"
            sx={{ minWidth: 650 }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                {thTable.map((th) => {
                  return (
                    <TableCell
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
              {dbBoard.users &&
                dbBoard.users.map((user: User) => (
                  <React.Fragment>
                    <TableRow
                      key={user.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      onClick={() =>
                        setOpenCollapseUser(
                          user.id === openCollapseUser?.id ? undefined : user
                        )
                      }
                    >
                      <TableCell
                        className="table-cell-mobile"
                        align="right"
                        component="th"
                        scope="row"
                      >
                        {user.name}
                      </TableCell>
                      <TableCell className="table-cell-mobile" align="right">
                        {user.seats.length}
                      </TableCell>
                      <TableCell className="table-cell-mobile" align="right">
                        {user.debts.length}
                      </TableCell>

                      <TableCell
                        className="table-cell-mobile"
                        sx={{ display: "flex", gap: 2 }}
                        align="right"
                      >
                        <div className="flex  gap-1">
                          <Button
                            onClick={() => {
                              setUserToEdit(user);
                              setEditModalIsOpen(true);
                              setNewDebt({
                                date: getCurrentDate(),
                                reason: "",
                                sum: 0,
                              });
                            }}
                            variant="contained"
                            startIcon={<Payment />}
                          >
                            <span className="mx-1">הוסף חוב</span>
                          </Button>
                        </div>
                      </TableCell>
                      {/* {openCollapseUser.id === user.id ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )} */}
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, padding: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={user.id === openCollapseUser?.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Table align="right" style={{ tableLayout: "auto" }}>
                            <TableBody>
                              {user.debts.length > 0 &&
                                user.debts.map((debt, debtidx: number) => {
                                  return (
                                    <TableRow className="!bg-['#e3d8d854'] table-row">
                                      <TableCell
                                        size="small"
                                        className="table-cell-debt"
                                        align="right"
                                        component="th"
                                        scope="row"
                                      >
                                        {debt.reason}
                                      </TableCell>
                                      <TableCell
                                        size="small"
                                        className="table-cell-debt-sum"
                                        align="right"
                                        component="th"
                                        scope="row"
                                      >
                                        {debt.sum}
                                      </TableCell>
                                      <TableCell
                                        size="small"
                                        className="table-cell-debt"
                                        align="right"
                                        component="th"
                                        scope="row"
                                      >
                                        {getCurrentDateDayFirstByGetDate(
                                          debt.date
                                        )}
                                      </TableCell>
                                      <TableCell
                                        size="small"
                                        className="table-cell-debt"
                                        align="right"
                                        component="th"
                                        scope="row"
                                      >
                                        <Delete
                                          onClick={() =>
                                            removeDebt(Number(debtidx))
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Modal
        sx={{ overflowY: "scroll", overflowX: "hidden" }}
        className="mx-2 px-3"
        open={editModalIsOpen}
        onClose={() => setEditModalIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDownloadImgBox}>
          <span className="text-2xl">{userToEdit?.name}</span>
          {newDebt &&
            debtInput.map((input) => {
              return input.options ? (
                <KdropDown
                  setItem={(e: KdropDownOption) =>
                    onChangeDebt(input.key, e.text)
                  }
                  options={input.options ?? []}
                />
              ) : (
                <TextField
                  sx={{ width: "80%" }}
                  dir="rtl"
                  id="filled-basic"
                  label={input.text}
                  name={""}
                  value={newDebt[input.key]}
                  type={input.type}
                  onChange={(e) => onChangeDebt(input.key, e.target.value)}
                  variant="filled"
                />
              );
            })}

          <div className="flex gap-3">
            <Button
              onClick={addDebt}
              disabled={!!!newDebt?.reason}
              variant="contained"
            >
              אישור
            </Button>

            <Button
              onClick={() => setEditModalIsOpen(false)}
              variant="contained"
            >
              ביטול
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
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          הפעולה בוצעה בהצלחה !{" "}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default EditUsers;

EditUsers.defaultProps = {};

interface Props {}

const styleDownloadImgBox = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "",
  boxShadow: 24,
  overflowY: "scroll",
  p: 6,
};
