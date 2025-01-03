import React, { useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Transformer,
  Group,
  Circle,
  Text,
} from "react-konva";
import Rectangle from "./Rectangle";
import Konva from "konva";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "..";
import { Board } from "../types/board";
import {
  startOverSeatsInSunday,
  updateBoaedSpesificKey,
  updateBoard,
} from "../service/serviceBoard";
import { useParams } from "react-router-dom";
import { RowOfSeats, Seat } from "../types/map";
import {
  generateRandomId,
  getLastSunday,
  isPastSixDays,
  isWithinSevenDaysFromLastSunday,
} from "../utils/utils";
import { Delete } from "@mui/icons-material";
import { Alert, Box, Button, Modal, Snackbar } from "@mui/material";
import KAutoComplete from "./KAutoComplete";
import KUser, { SeatNumber } from "../types/user";
import { KonvaEventObject } from "konva/lib/Node";
import AdminNavbar from "./AdminNavbar";
import AddUserModal from "./AddUserModal";
import { addNewUser } from "../service/serviceUser";
import MapIcon from "@mui/icons-material/Map";
import KPopover from "./KPopover";
import { PopoverOption } from "../types/popover";
export default function KMap({ parasha }: Props) {
  const HEIGHT_CANVAS = 800;
  const { id } = useParams();
  const [dbBoard, setDbBoard] = useState<Board>();
  const [rows, setRows] = useState<RowOfSeats[]>([]);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: HEIGHT_CANVAS,
  });
  const stageRef = useRef<Konva.Stage | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null); // Selected row ID
  const [rowCount, setRowCount] = useState(5); // Number of rectangles in the row
  const nextRowId = useRef(1); // Keeps track of the next row ID
  const transformerRef = useRef<Konva.Transformer>(null); // Ref for the transformer
  const groupRefs = useRef<Map<string, Konva.Group>>(new Map()); // Map to hold group refs for each row
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null); // Track selected seat
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMapMode, setIsEditMapMode] = useState<boolean>(false);
  const [isCreateNewMap, setIsCreateNewMap] = useState<boolean>(false);
  const [userToUpdateSeat, setUserToUpdateSeat] = useState<KUser>();
  const [addUserModalIsOpen, setAddUserModalIsOpen] = useState<boolean>(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>();
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<KUser>();
  const [rectSize, setRectSize] = useState<number>(30);
  const shapeRef = useRef(null);

  const newUser: KUser = {
    id: generateRandomId(),
    name: "",
    debts: [],
    present: false,
    seats: [],
  };
  // Handle window resizing
  useEffect(() => {
    async function fetchData() {
      if (id) {
        console.log("id", id);
        await startOverSeatsInSunday(id);
        await getBoardByIdSnap(id);
      }
    }
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: HEIGHT_CANVAS,
      });
    };

    window.addEventListener("resize", handleResize);
    fetchData();

    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
      groupRefs.current.clear(); // Clear all references when the component unmounts
    };
  }, []);

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
            if ((newBoard as Board).seats) {
              setRows((newBoard as Board).seats);
            }
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
  const handleDownload = () => {
    if (stageRef.current) {
      // Add a white background before exporting
      const layer = stageRef.current.getLayers()[0]; // Assuming the first layer
      const whiteBackground = new Konva.Rect({
        x: 0,
        y: 0,
        width: stageRef.current.width(),
        height: stageRef.current.height(),
        fill: "white",
      });

      layer.add(whiteBackground); // Temporarily add the white background
      whiteBackground.moveToBottom(); // Ensure the white background is behind everything else

      // Re-draw the layer with the white background
      layer.draw();

      // Export the stage as a data URL
      const uri = stageRef.current.toDataURL();

      // Remove the white background after export
      whiteBackground.destroy();
      layer.draw(); // Re-draw the layer to remove the white background

      // Create download link and trigger the download
      const link = document.createElement("a");
      link.href = uri;
      link.download = `${parasha} - סידורי ישיבה.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the link element
    }
  };
  const handleSundaySeatsRestart = async (event: PopoverOption) => {
    console.log("isOrk!!", event.value);

    if (id) {
      let lastSunday = getLastSunday();
      try {
        await updateBoaedSpesificKey(
          id,
          "startOverSeats",
          event.value ? lastSunday : ""
        );
      } catch (err) {
        console.log(err);
      }
    } else {
    }
  };

  const updateMap = async () => {
    try {
      if (id && dbBoard) {
        setDbBoard({
          ...dbBoard,
          seats: rows,
        });

        const newUsers = dbBoard.users?.map((user) => {
          let newSeats: SeatNumber[] = [...user.seats] ?? [];
          let allSeatsIds: string[] = [];
          rows.forEach((row) => {
            row.rectangles.forEach((rect, index) => {
              // This seat not belong to this suser
              allSeatsIds.push(rect.id);
              if (!user.seats.find((seat) => seat.seatNumber === rect.id)) {
                if (rect.userId === user.id) {
                  newSeats.push({ present: false, seatNumber: rect.id });
                }
              } else if (
                user.seats.find((seat) => seat.seatNumber === rect.id) &&
                rect.userId !== user.id
              ) {
                console.log(user.name, rect.id);
                newSeats = newSeats.filter(
                  (seat) => seat.seatNumber !== rect.id
                );
              }
            });
          });
          let userSeats = newSeats.filter((seat) =>
            allSeatsIds.includes(seat.seatNumber)
          );

          return { ...user, seats: userSeats };
        });

        await updateBoaedSpesificKey(id, "seats", rows);
        await updateBoaedSpesificKey(id, "users", newUsers);

        setSnackbarIsOpen(true);
        setTimeout(() => setSnackbarIsOpen(false), 2000);
      }
    } catch (err) {}
  };
  // Function to create a row of rectangles based on rowCount

  const createRow = () => {
    if (rowCount <= 0) {
      alert("Please enter a valid number of rectangles.");
      return;
    }

    const rowRects: Seat[] = [];
    const startX = rows.length > 0 ? rows[rows.length - 1].rectangles[0].x : 50; // starting X position
    const startY =
      rows.length > 0 ? rows[rows.length - 1].rectangles[0].y : 150; // starting Y position
    console.log(
      "startX",
      startX,
      "startY",
      startY,
      "startX + i * 40",
      startX * 40
    );
    for (let i = 0; i < rowCount; i++) {
      rowRects.push({
        x: startX + i * 40,
        y: 0, // Keep the y position relative to the row
        width: rectSize,
        height: rectSize,
        fill: "green",
        id: generateRandomId(),
        rotation: 0,
        userId: "",
        username: "",
      });
    }

    // Add a new row as a group
    const newRow: RowOfSeats = {
      id: generateRandomId(),
      rectangles: rowRects,
      rotation: 0,
      x: startX,
      y: startY,
      height: rectSize,
      width: rectSize,
    };

    setRows((prevRows) => [...prevRows, newRow]);
  };

  // Function to select the row and attach the transformer for rotation

  const handleRowDrag = (e: KonvaEventObject<DragEvent>, rowId: string) => {
    const newX = e.target.x();
    const newY = e.target.y();

    const updatedRows = rows.map((row) =>
      row.id === rowId ? { ...row, x: newX, y: newY } : row
    );
    setRows(updatedRows);
  };
  const handleTransformEnd = (e: KonvaEventObject<Event>, rowId: string) => {
    const node = e.target;
    const newWidth = e.currentTarget.getClientRect().width;
    const newHeight = e.currentTarget.getClientRect().height;

    const newRotation = node.rotation();
    // Update the row's rotation
    const updatedRows = rows.map((row) => {
      if (row.id === rowId) {
        // const newWidth = node.getClientRect().width / row.rectangles.length;
        // const newHeight = node.getClientRect().height;
        console.log("handleTransformEnd", row, e, rowId);

        const updatedRectangles = row.rectangles.map((rect, index) => {
          return {
            ...rect,

            rotation: 0,
          };
        });
        return {
          ...row,
          rectangles: updatedRectangles,
          rotation: newRotation,
          width: newWidth,
          height: newHeight,
        }; // Return updated row
      }
      return row; // Return unchanged row
    });
    setRows(updatedRows);
  };

  // Function to rotate the row by 10 degrees
  const handleCloseSnack = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarIsOpen(false);
  };
  const selectRow = (rowId: string) => {
    if (!isEditMapMode) return;
    console.log("rows", rows);
    setSelectedRowId(rowId);
    const selectedNode = groupRefs.current.get(rowId);
    if (selectedNode) {
      transformerRef.current?.nodes([selectedNode]); // Attach transformer
    }
  };
  const deleteRow = (rowId: string) => {
    // Clear the transformer before deleting
    if (selectedRowId === rowId) {
      setSelectedRowId(null); // Deselect the row
      transformerRef.current?.nodes([]); // Clear the transformer nodes
    }

    // Remove the row from the state
    const updatedRows = rows.filter((row) => row.id !== rowId);
    setRows(updatedRows);

    // Optionally remove the corresponding reference
    groupRefs.current.delete(rowId);
  };
  useEffect(() => {
    if (dbBoard) {
      setSettingMapOptions([
        { label: "הצג שמות", type: "switch", value: false, key: "showNames" },
        {
          label: "אפס נוכחות ביום א׳",
          type: "switch",
          value: !!dbBoard.startOverSeats,
          key: "refreshConfirm",
          function: handleSundaySeatsRestart,
        },
        {
          label: "הורד כתמונה",
          type: "button",
          value: false,
          key: "downloadImg",
          function: handleDownload,
        },
      ]);
    }
  }, [dbBoard]);
  const [settingMapOptions, setSettingMapOptions] = useState<PopoverOption[]>(
    []
  );
  const handleSeatClick = (seatId: string) => {
    if (isEditMapMode) return;
    setSelectedSeatId(seatId); // Set the selected seat ID
    const selectedRow = rows.find((row) =>
      row.rectangles.some((rect) => rect.id === seatId)
    );
    const selectedSeat = selectedRow?.rectangles.find(
      (rect) => rect.id === seatId
    );
    console.log(selectedSeat, "selectedSeat");
    console.log(seatId, "seatId");
    setIsModalOpen(true);

    if (selectedSeat?.userId) {
      const seatUser = dbBoard?.users?.find(
        (user) => user.id === selectedSeat?.userId
      );
      setUserToUpdateSeat(seatUser);
    }
  };
  const updateSeat = () => {
    if (userToUpdateSeat) {
      const updatedRows = rows.map((row) => {
        return {
          ...row,
          rectangles: row.rectangles.map((rect) =>
            rect.id === selectedSeatId
              ? {
                  ...rect,
                  userId: userToUpdateSeat?.id,
                  username: userToUpdateSeat.name,
                }
              : rect
          ),
        };
      });

      setRows(updatedRows);
      setSelectedSeatId(null);
      setIsModalOpen(false);
      setUserToUpdateSeat(undefined);
    }
  };

  const openAddUserModal = () => {
    setAddUserModalIsOpen(true);
    setUserToEdit(newUser);
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
  const setAllRectInRows = (size: number) => {
    console.log("size", size);
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        rectangles: row.rectangles.map((rect) => ({
          ...rect,
          height: size,
          width: size,
        })),
      }))
    );
    setRectSize(size);
  };
  return (
    <div>
      <AdminNavbar isUsersPage={true} setAddUserModal={openAddUserModal} />

      {((dbBoard?.seats?.length && dbBoard?.seats?.length > 0) ||
        isCreateNewMap) && (
        <div>
          <div className="flex w-full bg-blue-200 p-3 items-center justify-between">
            <div>
              {isEditMapMode && (
                <div className="flex w-72 gap-2  justify-center items-center">
                  <div className="flex flex-col gap-2 justify-center">
                    <div className="flex gap-2">
                      <span>שורה בת</span>
                      <input
                        type="number"
                        value={rowCount}
                        onChange={(e) => setRowCount(Number(e.target.value))}
                        min="1"
                        max="20"
                        style={{ marginRight: "10px" }}
                        placeholder="Number of rectangles"
                        className="bg-blue-200"
                      />

                      <span>מושבים</span>
                    </div>
                    <div>
                      <span>גודל מושבים</span>
                      <input
                        type="number"
                        value={rectSize}
                        onChange={(e) =>
                          setAllRectInRows(Number(e.target.value))
                        }
                        min="10"
                        max="50"
                        style={{ marginRight: "10px" }}
                        placeholder="Number of rect size"
                        className="bg-blue-200"
                      />
                    </div>
                  </div>
                  <Button onClick={createRow} variant="contained">
                    הוסף{" "}
                  </Button>
                </div>
              )}
              {!isEditMapMode && (
                <div>
                  <KPopover
                    options={settingMapOptions}
                    buttonText="הגדרות"
                    isOpen={isSettingOpen}
                    setOptions={setSettingMapOptions}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  transformerRef.current?.nodes([]);
                  setIsEditMapMode(!isEditMapMode);
                }}
                variant="contained"
              >
                {isEditMapMode ? "סיים עריכה" : "עריכה"}
              </Button>
              <Button onClick={updateMap} variant="contained">
                שמור שינויים
              </Button>
            </div>
          </div>

          <div className="p-2 border-blue-300 border-2">
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              ref={stageRef}
            >
              <Layer>
                {/* Transformer for rotating the row */}
                <Transformer ref={transformerRef} />

                {/* For each row, create a draggable and rotatable group */}
                {rows.map((row) => {
                  // Create a ref for each row if it doesn't exist
                  if (!groupRefs.current.has(row.id)) {
                    groupRefs.current.set(
                      row.id,
                      React.createRef<Konva.Group>().current!
                    );
                  }
                  // groupRefs.current
                  //   .get(row?.id)
                  //   ?.setSize({ height: rectSize * 5, width: rectSize * 5 });

                  console.log(
                    "groupRefs height",
                    groupRefs.current.get(row?.id)?.getSize()
                  );

                  return (
                    <Group
                      key={row.id}
                      ref={(el) => {
                        if (el) {
                          groupRefs.current.set(row.id, el);
                        } else {
                          groupRefs.current.delete(row.id);
                        }
                      }}
                      x={row.x}
                      y={row.y}
                      draggable={isEditMapMode}
                      onDragEnd={(e) => handleRowDrag(e, row.id)}
                      rotation={row.rotation}
                      onClick={() => selectRow(row.id)}
                      onTransformEnd={(e) => handleTransformEnd(e, row.id)}
                    >
                      {row.rectangles.map((rect) => {
                        const user = dbBoard?.users?.find(
                          (user) => user.id === rect.userId
                        );

                        return (
                          <div onClick={() => handleSeatClick(rect.id)}>
                            <Rectangle
                              isEditMapMode={isEditMapMode}
                              key={rect.id}
                              fill={
                                user
                                  ? user.seats.find(
                                      (seat) => seat.seatNumber === rect.id
                                    )?.present
                                    ? "green"
                                    : "gray"
                                  : "red"
                              }
                              shapeProps={rect}
                              showNames={
                                !!settingMapOptions?.find(
                                  (set) => set.key === "showNames"
                                )?.value
                              }
                            />
                          </div>
                        );
                      })}
                      {/* Delete button */}
                      {isEditMapMode && (
                        <Text
                          x={row.rectangles[0].x - 15}
                          y={row.rectangles[0].y}
                          text="x"
                          fontSize={25}
                          fill="balck"
                          fontStyle="bold"
                          onClick={() => deleteRow(row.id)} // Text clickable too
                        />
                      )}
                    </Group>
                  );
                })}
              </Layer>
            </Stage>
          </div>
          <div className="flex w-full justify-between items-center font-['Nachlieli']">
            <div className="flex gap-2 px-4 w-full justify-start mt-5 items-center">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-red-500 shadow-md rounded-sm"></span>
                <span>
                  {dbBoard?.seats?.reduce((acc, seats) => {
                    return (
                      seats.rectangles.filter((seat) => !seat.userId).length +
                      acc
                    );
                  }, 0)}
                </span>
              </span>
              <span className="flex items-center  ">
                <span className="w-2 h-4 bg-gray-500 shadow-md rounded-sm"></span>
                <span className="w-2 h-4 bg-green-500 shadow-md rounded-sm"></span>
                <span className="px-1">
                  {dbBoard?.seats?.reduce((acc, seats) => {
                    return (
                      seats.rectangles.filter((seat) => seat.userId).length +
                      acc
                    );
                  }, 0)}
                </span>
              </span>
            </div>
            <div className="flex gap-2 px-4 w-full justify-end mt-5 items-center">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-green-500 shadow-md rounded-sm"></span>
                <span> נמצא</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gray-500 shadow-md rounded-sm"></span>
                <span> לא נמצא</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-red-500 shadow-md rounded-sm"></span>
                <span> ריק</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {dbBoard?.seats?.length === 0 && !isCreateNewMap && (
        <div className="w-full sm:mt-10 mt-5 justify-center items-center flex font-['Nachlieli']">
          <div className="flex w-2/3 gap-2 flex-col  text-center justify-center items-center">
            <span className=" text-blue-400 text-4xl font-bold">היי!</span>
            <span className=" text-blue-400 text-3xl font-bold">
              עדיין לא יצרתם את מפת בית הכנסת שלכם ?
            </span>
            <span className=" text-balck text-2xl font-bold">
              יצירת מפה עוזרת לכם להיות בשליטה על נוכחות ומקומות הישיבה בבית
              הכנסת, כל משתמש יכול להכנס לאיזור האישי שלו ולעדכן את הנוכחות שלו.
              את המפה אפשר להציג על המסך ואפשר גם להדפיס ולשמור אצל הגבאי
            </span>
            <span className=" text-blue-400 text-4xl font-bold">
              אז למה אתם מחכים?
            </span>
            <Button
              startIcon={<MapIcon />}
              onClick={() => {
                setIsCreateNewMap(true);
                transformerRef.current?.nodes([]);
                setIsEditMapMode(true);
              }}
              variant="contained"
              className="flex gap-2"
            >
              צור מפה
            </Button>
          </div>
        </div>
      )}

      <Modal
        sx={{ overflowY: "scroll", overflowX: "hidden" }}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserToUpdateSeat(undefined);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {dbBoard?.users && dbBoard.users.length > 0 && (
            <div className="w-full h-full flex  flex-col gap-3 font-['Nachlieli']">
              <span dir="rtl" className="text-center text-3xl">
                {" "}
                {userToUpdateSeat?.name
                  ? ` כסא שייך ל${userToUpdateSeat?.name}`
                  : "איזה כיף הכיסא פנוי!"}
              </span>
              {userToUpdateSeat?.name && (
                <span className="text-center"> לשינוי הבעלים של הכסא </span>
              )}
              <span className="text-center">בחר שם מהרשימה</span>
              <KAutoComplete
                options={dbBoard?.users}
                onPickUsername={(e: KUser) => setUserToUpdateSeat(e)}
              />
              <Button
                disabled={!userToUpdateSeat}
                onClick={updateSeat}
                variant="contained"
              >
                אישור
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedSeatId(null);
                  setUserToUpdateSeat(undefined);
                }}
                variant="contained"
              >
                ביטול
              </Button>
            </div>
          )}
          {dbBoard?.users && dbBoard.users.length === 0 && (
            <div>
              <div className="flex  font-['Nachlieli'] w-full gap-2 flex-col  text-center justify-center items-center">
                <span className=" text-blue-400 text-4xl font-bold">
                  אופסס{" "}
                </span>
                <span className=" text-blue-400 text-3xl font-bold">
                  לפני שאתה משייך כסא למתפלל עליך ליצור מתפללים
                </span>
                <span className=" text-blue-400 text-3xl font-bold"></span>

                <Button
                  onClick={() => {
                    openAddUserModal();
                    setIsModalOpen(false);
                    setUserToUpdateSeat(undefined);
                  }}
                  variant="contained"
                  className="flex gap-2"
                >
                  צור מתפלל חדש
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Modal>

      {userToEdit && newUser && (
        <AddUserModal
          userToEdit={userToEdit}
          addUser={addUser}
          editModalIsOpen={addUserModalIsOpen}
          newUser={newUser}
          setEditModalIsOpen={setAddUserModalIsOpen}
          setUserToEdit={setUserToEdit}
        />
      )}
      <Snackbar
        className="flex flex-row-reverse"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarIsOpen}
        dir="rtl"
        key={"bottom" + "center"}
      >
        <Alert
          onClose={handleCloseSnack}
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

KMap.defaultProps = {
  parasha: "",
};
interface Props {
  parasha: string;
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
