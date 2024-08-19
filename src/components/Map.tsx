import React, { useEffect, useRef, useState } from "react";
import KUser, { SeatNumber } from "../types/user";
import chair from "../assets/chair.svg";
import man from "../assets/man.svg";
import { collection, doc } from "firebase/firestore";
import { db } from "..";
import { onSnapshot } from "firebase/firestore";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Menu,
  Modal,
} from "@mui/material";
import { toPng } from "html-to-image";
import { Board } from "../types/board";
import { useParams } from "react-router-dom";
import OutoComplete from "./OutoComplete";
import { updateManyUsers, updateUser } from "../service/serviceUser";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import GoogleAuth from "./GoogleAuth";
import AdminNavbar from "./AdminNavbar";

function Map(props: Props) {
  const seat = [8, 18];
  const allSeats: any = [];
  const [seats, setSeats] = useState<KUser[]>();
  const [editingUser, setEditingUser] = useState<KUser>();
  const [editingSeatNumber, setEditingSeatNumber] = useState<string>();
  const [showName, setShowName] = useState<boolean>(false);
  const [userToUpdateSeat, setUserToUpdateSeat] = useState<KUser>();
  const elementRef = useRef(null);
  const [dbBoard, setDbBoard] = useState<Board>();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [connectedUser, setConnectedUser] = useState<User>();
  const auth = getAuth();
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("connected user", user);
        setConnectedUser(user);
        // ...
      } else {
        console.log("USER FIRBASE NOT FOUND");
        // User is signed out
        // ...
      }
    });
    async function fetchData() {
      // await getUsers();
      if (id) {
        await getBoardByIdSnap(id);
      }
    }
    fetchData();
    return unsubscribe;
  }, []);
  // useEffect(() => {}, [seats?.length]);
  const getBoardByIdSnap = async (boardId: string) => {
    try {
      const boardRef = doc(db, "boards", boardId);

      // Listen to changes in the board document
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        if (boardDoc.exists()) {
          // Document exists, push its data into the array along with the ID
          const newBoard: Board = {
            ...(boardDoc.data() as Board),
            id: boardDoc.id,
          };
          console.log("newBoard.users", newBoard.users);
          console.log("dbBoard.users", dbBoard?.users);
          console.log(
            "newBoard.users === dbBoard.users",
            JSON.stringify(newBoard.users) !== JSON.stringify(dbBoard?.users)
          );

          if (
            newBoard.id &&
            JSON.stringify(newBoard.users) !== JSON.stringify(dbBoard?.users)
          ) {
            setTimeout(() => {
              setDbBoard(newBoard as Board);
              getSeats(JSON.parse(JSON.stringify(newBoard.users)));
              // console.log("users", newBoard.users);
            }, 1500);
          }
        } else {
          // Document does not exist
          console.log("Board not found");
        }
      });

      // Return the array and the unsubscribe function
      return { unsubscribe };
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };

  const getSeats = (users: KUser[]) => {
    try {
      // console.log("users", users);
      for (var i = 0; i < seat[0]; i++) {
        allSeats[i] = [];
        for (var j = 0; j < seat[1]; j++) {
          if (j > 6 && j < 11 && i > 2) {
            allSeats[i][j] = "";
          } else {
            let currentSeat = `${i}${j}`;
            allSeats[i][j] =
              users.find((user: KUser) =>
                user.seats?.find(
                  (seat: SeatNumber) => seat.seatNumber === currentSeat
                )
              ) ?? currentSeat;
          }
        }
      }
      setSeats(JSON.parse(JSON.stringify(allSeats)));
      // console.table(allSeats);
    } catch (err) {
      console.log(err);
    }
  };
  const htmlToImageConvert = () => {
    if (elementRef.current) {
      toPng(elementRef.current, {
        cacheBust: false,
        backgroundColor: "#f2d4b0",
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = ` ${props?.parasha} - סידורי ישיבה.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const updateSeat = async () => {
    setIsModalOpen(false);
    if (editingUser && userToUpdateSeat && editingSeatNumber) {
      const seatIsExistInUser = userToUpdateSeat.seats.find(
        (seat) => seat.seatNumber === editingSeatNumber
      );
      if (!seatIsExistInUser) {
        const newUserToUpdateSeat: KUser = {
          ...userToUpdateSeat,
          seats: [
            ...(userToUpdateSeat?.seats ?? []),
            {
              present: !!userToUpdateSeat.present,
              seatNumber: editingSeatNumber,
            },
          ],
        };
        const newEditingUserToRemoveSeat: KUser = {
          ...editingUser,
          seats: editingUser?.seats.filter(
            (seat: SeatNumber) => seat.seatNumber !== editingSeatNumber
          ),
        };
        console.log("newEditingUserToRemoveSeat", newEditingUserToRemoveSeat);
        console.log("newUserToUpdateSeat", newUserToUpdateSeat);
        try {
          if (id && newUserToUpdateSeat.id && newEditingUserToRemoveSeat.id) {
            await updateManyUsers(id, [
              newEditingUserToRemoveSeat,
              newUserToUpdateSeat,
            ]);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };
  if (
    connectedUser?.email &&
    dbBoard?.admins &&
    !dbBoard?.admins.includes(connectedUser?.email)
  ) {
    return (
      <Box sx={styleBoxNotAllowEdit}>
        <div className="flex w-full flex-col justify-center items-center m-2">
          {connectedUser && (
            <div className="flex flex-col">
              <span>שלום {connectedUser.displayName}</span>
              <span>למשתמש {connectedUser.email} אין הרשאה לערוך לוח זה</span>
            </div>
          )}
          <GoogleAuth
            setUser={setConnectedUser}
            userConnected={connectedUser?.email ?? ""}
          />
        </div>
      </Box>
    );
  } else if (!connectedUser) {
    <Box sx={styleBoxNotAllowEdit}>
      <GoogleAuth setUser={setConnectedUser} userConnected={""} />
    </Box>;
  }

  return (
    <div className="flex flex-col">
      <AdminNavbar />

      <div
        dir="ltr"
        className="bg-[#f2d4b0]  flex flex-col items-center overflow-x-auto justify-center text-black"
      >
        {seats && seats?.length > 1 && (
          <div className="m-2 w-full flex justify-center gap-6 items-center ">
            <Button
              onClick={htmlToImageConvert}
              variant="contained"
              color="primary"
            >
              הורדת תמונה{" "}
            </Button>

            <FormControlLabel
              dir="rtl"
              control={
                <Checkbox
                  onChange={(e) => setShowName(!!e.target.checked)}
                  defaultChecked
                  checked={showName}
                />
              }
              label="הצג שמות"
            />
          </div>
        )}
        {/* {!seats && (
        <div className="flex ">
          <CircularProgress />
        </div>
      )} */}
        <div className="flex flex-col items-center" ref={elementRef}>
          <table>
            <tbody>
              {seats &&
                seats?.length > 1 &&
                seats?.map((row: any, rowIndex: number) => (
                  <tr className="py-2 flex" key={rowIndex}>
                    {row.map((seatData: KUser, columnIndex: number) => {
                      let currentSeatNumber = `${rowIndex}${columnIndex}`;
                      return seatData.name ? (
                        <td
                          className="px-2 w-14 h-14 flex flex-col items-center justify-center relative td-table-seat"
                          key={columnIndex}
                          onClick={() => {
                            setUserToUpdateSeat(seatData);
                            setIsModalOpen(true);
                            setEditingUser(seatData);
                            setEditingSeatNumber(currentSeatNumber);
                          }}
                          style={{
                            marginLeft:
                              (currentSeatNumber?.length === 3 &&
                                currentSeatNumber?.split("")[2] === "4") ||
                              (currentSeatNumber?.length === 2 &&
                                currentSeatNumber?.split("")[1] === "4") ||
                              (currentSeatNumber?.length === 2 &&
                                currentSeatNumber?.split("")[1] === "9")
                                ? "25px"
                                : "",
                          }}
                        >
                          <img
                            src={chair}
                            className={`${
                              typeof seatData === "object" && seatData.present
                                ? ""
                                : "not-present"
                            } w-12 h-12 shadow-xl rounded-lg`}
                            alt="logo"
                          />
                          {typeof seatData === "object" && seatData.present && (
                            <img
                              src={man}
                              className="w-4 h-4 absolute bottom-[20px]"
                              alt="man"
                            />
                          )}
                          <span
                            className="shadow-innerdow"
                            style={{
                              fontSize:
                                seatData.name.split(" ").length === 2
                                  ? "9px"
                                  : "12px",
                            }}
                          >
                            {showName &&
                              (typeof seatData === "object"
                                ? seatData.name
                                : seatData)}
                            {/* {currentSeatNumber} */}
                          </span>
                        </td>
                      ) : (
                        <td
                          className="px-2 w-14 h-14 flex flex-col items-center justify-center relative"
                          key={columnIndex}
                          style={{
                            marginLeft:
                              (currentSeatNumber?.length === 3 &&
                                currentSeatNumber?.split("")[2] === "4") ||
                              (currentSeatNumber?.length === 2 &&
                                currentSeatNumber?.split("")[1] === "4") ||
                              (currentSeatNumber?.length === 2 &&
                                currentSeatNumber?.split("")[1] === "9")
                                ? "25px"
                                : "",
                          }}
                        >
                          {/* {currentSeatNumber} */}
                          {currentSeatNumber === "48" && (
                            <div className=" border-2 flex justify-center items-center absolute border-black h-32 w-44 left-[-18px] text-black ">
                              תיבה
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
          {seats && seats?.length > 1 && (
            <div className=" border-2 flex justify-center items-center p-2 mb-2  border-black h-32 w-3/4 left-[-18px] text-black ">
              ארון
            </div>
          )}
        </div>
        <Modal
          sx={{ overflowY: "scroll", overflowX: "hidden" }}
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {dbBoard?.users && dbBoard.users.length > 0 && (
              <div className="w-full h-full flex flex-col gap-3">
                <span className="text-center"> {userToUpdateSeat?.name}</span>

                <span className="text-center">בחר שם מהרשימה</span>
                <OutoComplete
                  options={dbBoard?.users}
                  onPickUsername={(e: KUser) => setUserToUpdateSeat(e)}
                />
                <Button onClick={updateSeat} variant="contained">
                  אישור
                </Button>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setUserToUpdateSeat(undefined);
                    setEditingUser(undefined);
                    setEditingSeatNumber("");
                  }}
                  variant="contained"
                >
                  ביטול
                </Button>
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Map;

Map.defaultProps = {
  parasha: "",
};

interface Props {
  parasha?: string;
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
const styleBoxNotAllowEdit = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "",
  boxShadow: 24,
  p: 6,
};
