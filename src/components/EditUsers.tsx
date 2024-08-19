import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Board } from "../types/board";
import { db } from "..";
import KUser, {
  Debt,
  DebtReason,
  Filter,
  Filters,
  SeatUser,
} from "../types/user";
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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { ExpandLess, ExpandMore, Payment, AddCard } from "@mui/icons-material";
import { updateBoard } from "../service/serviceBoard";
import { Delete, Cancel } from "@mui/icons-material";
import TableRow from "@mui/material/TableRow";
import { generateRandomId, getCurrentDate } from "../utils/utils";
import { getCurrentDateDayFirstByGetDate } from "../utils/const";
import KdropDown from "./KdropDown";
import { KdropDownOption } from "../types/dropDown";
import { addNewUser, updateUser } from "../service/serviceUser";
import AdminNavbar from "./AdminNavbar";
function EditUsers(props: Props) {
  const { id } = useParams();
  const [dbBoard, setDbBoard] = useState<Board>();
  const [userToEdit, setUserToEdit] = useState<KUser>();
  const [openCollapseUser, setOpenCollapseUser] = useState<KUser | undefined>(
    undefined
  );
  const [filters, setFilters] = useState<Filters>({ name: "", debt: false });
  const [newDebt, setNewDebt] = useState<Debt>();
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const [addUserModalIsOpen, setAddUserModalIsOpen] = useState<boolean>(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>();
  // TASK 9: EDIT USER - DONE
  // TASK 7: ADD SOCKET IN EDIT - DONE
  // TASK 12: CREATE MODAL TO EDIT MODE -  DONE

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
  const newUser: KUser = {
    id: generateRandomId(),
    name: "",
    debts: [],
    present: false,
    seats: [],
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

  const filtersKeys: Filter[] = [
    { key: "name", text: "חיפוש לפי שם", type: "text" },
    { key: "debt", text: "בעלי חוב", type: "checkBox" },
  ];

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
  const onMarkDebtAsPaid = async (debtIdx: number) => {
    if (openCollapseUser?.debts && openCollapseUser?.debts.length > 0) {
      const newDebts = openCollapseUser?.debts;
      const newDebtToEdit = openCollapseUser?.debts[debtIdx];
      newDebtToEdit.isPaid = !newDebtToEdit.isPaid;
      newDebts.splice(debtIdx, 1, newDebtToEdit);

      setUserToEdit({
        ...openCollapseUser,
        debts: newDebts,
      });
      const newUserToEdit = { ...openCollapseUser, debts: [...newDebts] };
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

  const addDebt = async () => {
    let userIdx: number = NaN;
    if (dbBoard?.users && userToEdit) {
      const user: KUser | undefined = dbBoard?.users.find(
        (user: KUser, idx: number) => {
          if (user.id === userToEdit?.id) {
            userIdx = idx;
            return true;
          }
        }
      );

      if (userIdx && user && user?.debts && newDebt) {
        const newDebts: Debt[] = [...user?.debts, newDebt];

        if (newDebts) {
          setUserToEdit({
            ...userToEdit,
            debts: [...newDebts],
          });
        }
        console.log("userToEdit", userToEdit);
        const newUserToEdit = { ...userToEdit, debts: [...newDebts] };
        // const newUsers = dbBoard.users;
        // newUsers.splice(userIdx, 1, newUserToEdit);
        // setDbBoard({
        //   ...dbBoard,
        //   users: newUsers,
        // });
        setEditModalIsOpen(false);
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
    }
  };

  const removeDebt = async (debtIdx: number) => {
    const newDebts = openCollapseUser?.debts;
    let userIdx: number = NaN;
    console.log("openCollapseUser", openCollapseUser);

    if (dbBoard?.users && openCollapseUser) {
      const user: KUser | undefined = dbBoard?.users.find(
        (user: KUser, idx: number) => {
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
      if (userIdx && user && user?.debts && newDebts) {
        if (newDebts) {
          newDebts.splice(debtIdx, 1);
          setUserToEdit({
            ...openCollapseUser,
            debts: newDebts,
          });
          const newUserToEdit = { ...openCollapseUser, debts: [...newDebts] };
          // const newUsers = dbBoard.users;
          // newUsers.splice(userIdx, 1, newUserToEdit);

          try {
            if (id) {
              await updateUser(id, newUserToEdit);
              // setDbBoard({
              //   ...dbBoard,
              //   users: newUsers,
              // });
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
  const addUser = async () => {
    try {
      if (id && userToEdit) {
        await addNewUser(id, userToEdit);
        setAddUserModalIsOpen(false);
        setSnackbarIsOpen(true);
        setTimeout(() => setSnackbarIsOpen(false), 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const openAddUserModal = () => {
    setAddUserModalIsOpen(true);
    setUserToEdit(newUser);
  };
  return (
    <div className="flex flex-col">
      <AdminNavbar isUsersPage={true} setAddUserModal={openAddUserModal} />
      <div className="w-full flex items-center  gap-2">
        {filters &&
          filtersKeys.map((filter: Filter) => {
            return filter.type === "text" ? (
              <TextField
                sx={{ width: "50%" }}
                dir="rtl"
                id="filled-basic"
                label={filter.text}
                name={""}
                value={filters[filter.key]}
                type={filter.type}
                onChange={(e) =>
                  setFilters({ ...filters, [filter.key]: e.target.value })
                }
                variant="filled"
              />
            ) : (
              <div className="text-black  transition-all  items-center justify-center">
                <Checkbox
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      [filter.key]: e.target.checked,
                    })
                  }
                  defaultChecked
                  checked={filters.debt}
                />
                <span className="font-sans  whitespace-nowrap">
                  {filter.text}
                </span>
              </div>
            );
          })}
      </div>
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
                dbBoard.users
                  .filter((user: KUser) =>
                    filters.debt
                      ? user.name.includes(filters.name) &&
                        user?.debts.length > 0
                      : user.name.includes(filters.name)
                  )
                  .map((user: KUser) => (
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
                          <span
                            style={{
                              color: user?.debts.length > 0 ? "red" : "black",
                            }}
                          >
                            {user?.debts.length}
                          </span>
                        </TableCell>

                        <TableCell
                          className="table-cell-mobile-button"
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
                                  reason: "עלייה לתורה",
                                  sum: 0,
                                  isPaid: false,
                                });
                              }}
                              variant="contained"
                              startIcon={<AddCard />}
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
                            <Table
                              dir="rtl"
                              align="right"
                              sx={{
                                tableLayout: "fixed",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "start",
                                alignItems: "start",
                              }}
                            >
                              {user?.debts.length > 0 &&
                                user?.debts.map((debt, debtidx: number) => {
                                  return (
                                    <React.Fragment>
                                      <TableHead className="debt-title">
                                        נדרים
                                      </TableHead>
                                      <TableRow className="bg-[#e3d8d854] !flex  table-row ">
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
                                        <FormControlLabel
                                          sx={{
                                            margin: 0,
                                          }}
                                          control={
                                            <Checkbox
                                              onChange={() =>
                                                onMarkDebtAsPaid(debtidx)
                                              }
                                              defaultChecked
                                              checked={debt.isPaid}
                                              style={{
                                                color: "green",
                                                padding: 3,
                                              }}
                                            />
                                          }
                                          label="שולם"
                                        />
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
                                    </React.Fragment>
                                  );
                                })}
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
        open={editModalIsOpen || addUserModalIsOpen}
        onClose={() => {
          setEditModalIsOpen(false);
          setAddUserModalIsOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDownloadImgBox}>
          {editModalIsOpen ? (
            <div className="flex flex-col gap-4 justify-center items-center w-full">
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
            </div>
          ) : (
            <div className="flex flex-col gap-4 justify-center items-center w-full">
              <span className="text-2xl">הוסף מתפלל</span>
              {userToEdit &&
                Object.keys(newUser).map((key: string) => {
                  return (
                    <div>
                      {!Array.isArray(userToEdit[key as keyof KUser]) &&
                        key !== "id" &&
                        key !== "present" && (
                          <TextField
                            sx={{ width: "100%%" }}
                            dir="rtl"
                            id="filled-basic"
                            label={key}
                            name={""}
                            value={userToEdit[key as keyof KUser]}
                            type="text"
                            onChange={(e) =>
                              setUserToEdit({
                                ...userToEdit,
                                [key]: e.target.value, // Update the correct property in userToEdit
                              })
                            }
                            variant="filled"
                          />
                        )}
                    </div>
                  );
                })}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => {
                editModalIsOpen ? addDebt() : addUser();
              }}
              disabled={
                editModalIsOpen ? !!!newDebt?.reason : !!!userToEdit?.name
              }
              variant="contained"
            >
              אישור
            </Button>

            <Button
              onClick={() => {
                setEditModalIsOpen(false);
                setAddUserModalIsOpen(false);
              }}
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
