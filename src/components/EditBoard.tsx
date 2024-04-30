import { useEffect, useState } from "react";
import { Board, Message, Tfila, Theme } from "../types/board";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "..";
import { Delete } from "@mui/icons-material";

import {
  DateToShow,
  beautyColorsHex,
  dateToShow,
  translationsZmanimKeys,
} from "../utils/const";
import { TranslationsZmanimKeys, Zman } from "../types/zmanim";

function EditBoard(props: Props) {
  const [dbBoard, setDbBoard] = useState<Board>();
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>();
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    async function fetchData() {
      if (id) {
        console.log("id", id);
        await getBoardById(id);
      }
    }
    fetchData();
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
  // const board: Board = {
  //   boardBackgroundImage: "",
  //   city: "",
  //   forMedicine: [""],
  //   forUplifting: [""],
  //   geoId: "",
  //   mapBackgroundImage: "",
  //   messages: [{ title: "", content: "", date: new Date() }],
  //   tfilaTimes: [{ isSaturdayTfila: true, name: "מנחה", time: "" }],
  //   theme: "regular",
  //   timeScreenPass: "",
  //   timesToShow: ["chatzot", "dusk"],
  //   users: [],
  // };
  const handleTimesChange = (time: keyof TranslationsZmanimKeys) => {
    let newArray;
    if (dbBoard?.timesToShow.includes(time)) {
      newArray = dbBoard?.timesToShow.filter((item) => item !== time);
    } else if (dbBoard?.timesToShow) {
      newArray = [...dbBoard?.timesToShow, time];
    }
    if (dbBoard?.timesToShow && newArray) {
      setDbBoard({
        ...dbBoard,
        timesToShow: newArray,
      });
    }
  };
  // DATA
  const dataKeysToHebrewName: { [key: string]: string } = {
    name: "שם",
    time: "זמן",
    content: "שם",
  };
  const inputsBoard: { name: keyof Board; placeholder: string }[] = [
    { name: "boardName", placeholder: "שם בית כנסת" },
    { name: "geoId", placeholder: "איזור לעדכון זמן" },
    { name: "timeScreenPass", placeholder: "זמן מעבר בין מסכים" },
    { name: "tfilaTimes", placeholder: "זמני תפילה" },
    { name: "forUplifting", placeholder: "לעילוי נשמת" },
    { name: "dateTypes", placeholder: "סוג תאריך" },
    { name: "forMedicine", placeholder: "לרפואה" },
    { name: "messages", placeholder: "הודעות לציבור " },
    { name: "boardTextColor", placeholder: "צבע טקסט" },
    { name: "boardBackgroundImage", placeholder: "תמונת רקע ללוח" },
    { name: "mapBackgroundImage", placeholder: "תמונת רקע למפה" },
    { name: "timesToShow", placeholder: "זמנים להצגה" },
    { name: "users", placeholder: "משתמשים" },
    { name: "theme", placeholder: "ערכת נושא" },
  ];
  const thems: { name: Theme; title: string }[] = [
    { name: "regular", title: "רגיל" },
    { name: "nature", title: "טבע" },
    { name: "gold", title: "מהודר" },
  ];
  const boardTextColors: { name: string; title: string }[] = [
    { name: "black", title: "שחור" },
    { name: "auto", title: "אוטומטי" },
  ];
  const handleInputArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    arrayName: "tfilaTimes" | "forUplifting" | "forMedicine" | "messages",
    isBollean?: boolean
  ) => {
    const { name, value } = e.target;
    console.log(
      name,
      ":",
      (e as React.ChangeEvent<HTMLInputElement>).target.checked
    );
    if (dbBoard && Array.isArray(dbBoard[arrayName])) {
      const updatedArray = dbBoard[arrayName]?.map(
        (item: Object, i: number) => {
          if (i === index && typeof item === "object") {
            return {
              ...item,
              [name]: isBollean
                ? (e as React.ChangeEvent<HTMLInputElement>).target.checked
                : value,
            };
          }
          return item;
        }
      );
      setDbBoard({
        ...dbBoard,
        [arrayName]: updatedArray,
      });
      console.log(dbBoard[arrayName]);
    }
  };
  const addObjectToArray = (
    arrayName: "tfilaTimes" | "forUplifting" | "forMedicine" | "messages"
  ) => {
    if (dbBoard && Array.isArray(dbBoard[arrayName])) {
      if (arrayName !== "tfilaTimes") {
        const addObjectToArray: Message[] = dbBoard[arrayName];
        let newItem: Message = { content: "", date: new Date() };
        addObjectToArray.push(newItem);
        setDbBoard({
          ...dbBoard,
          [arrayName]: addObjectToArray,
        });
      } else if (arrayName === "tfilaTimes") {
        const addObjectToArray: Tfila[] = dbBoard[arrayName];
        let newItem: Tfila = { isSaturdayTfila: false, name: "", time: "" };
        addObjectToArray.push(newItem);
        setDbBoard({
          ...dbBoard,
          [arrayName]: addObjectToArray,
        });
      }
    }
  };
  const removeObjectFromArray = (
    arrayName: "tfilaTimes" | "forUplifting" | "forMedicine" | "messages",
    idx: number
  ) => {
    if (dbBoard && Array.isArray(dbBoard[arrayName])) {
      const removeObjectToArray = (
        dbBoard[arrayName] as (Message | Tfila)[]
      ).filter((item: Message | Tfila, index: number) => idx !== index);
      console.log("addObjectToArray", removeObjectToArray);
      setDbBoard({
        ...dbBoard,
        [arrayName]: removeObjectToArray,
      });
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, ":", value);
    if (dbBoard) {
      setDbBoard({
        ...dbBoard,
        [name]: value,
      });
    }
    console.log(e.target.value);

    // const newBoard={...dbBoard}
    // setDbBoard()
  };
  const updateBoard = async (boardId: string, boardData: any) => {
    if (!boardId) return;
    const boardRef = doc(collection(db, "boards"), boardId); // Get reference to the user document
    try {
      await updateDoc(boardRef, boardData); // Update the user document with new data
      console.log("User updated successfully!");
      setSnackbarIsOpen(true);
      setTimeout(() => setSnackbarIsOpen(false), 2000);
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
  const showBoard = (id: String) => {
    if (id) {
      navigate(`/board/${id}`);
    }
  };

  return (
    <div
      style={{
        background: `url(${require("../assets/edit-bg.jpg")}) `,
        backgroundSize: "cover !importent",
      }}
      className=" flex flex-col gap-2 sm:justify-center sm:items-center sm:w-full "
    >
      <div className=" sm:grid grid-cols-2 flex flex-col gap-2">
        {dbBoard &&
          inputsBoard.map(({ name, placeholder }) => {
            return (
              <div key={name} className="flex flex-col gap-1 p-2">
                {name !== "users" && <span>{placeholder}:</span>}
                {!Array.isArray(dbBoard[name]) &&
                  name !== "boardBackgroundImage" &&
                  name !== "mapBackgroundImage" &&
                  name !== "boardTextColor" &&
                  name !== "dateTypes" &&
                  name !== "theme" && (
                    <TextField
                      dir="rtl"
                      id="filled-basic"
                      label={placeholder}
                      value={dbBoard[name]}
                      name={name}
                      onChange={(e) => handleChange(e)}
                      variant="filled"
                    />
                  )}
                {name === "tfilaTimes" &&
                  dbBoard[name].map((tfila: Tfila, idx) => (
                    <div key={idx} className="flex  gap-1">
                      {Object.keys(tfila).map((key: string) => {
                        return (
                          key !== "isSaturdayTfila" && (
                            <div className="flex" key={key}>
                              <TextField
                                dir="rtl"
                                id="filled-basic"
                                label={dataKeysToHebrewName[key]}
                                name={key}
                                value={tfila[key as keyof Tfila]}
                                onChange={(e) =>
                                  handleInputArrayChange(e, idx, name)
                                }
                                variant="filled"
                              />
                            </div>
                          )
                        );
                      })}
                      {
                        <div className="flex">
                          <div className="flex flex-col items-center justify-center text-center">
                            {
                              <Checkbox
                                onChange={(e) =>
                                  handleInputArrayChange(e, idx, name, true)
                                }
                                name={"isSaturdayTfila"}
                                checked={tfila.isSaturdayTfila}
                              />
                            }
                            <span>תפילת שבת</span>
                          </div>
                          <Button
                            onClick={(e) => removeObjectFromArray(name, idx)}
                            startIcon={<Delete />}
                          >
                            הסר
                          </Button>
                        </div>
                      }
                    </div>
                  ))}
                {(name === "messages" ||
                  name === "forMedicine" ||
                  name === "forUplifting") &&
                  dbBoard[name].map((tfila: Message, idx) => (
                    <div key={idx} className="flex w-full  gap-1">
                      {Object.keys(tfila).map((key: string) => {
                        return (
                          key !== "date" && (
                            <div className="flex w-full" key={key}>
                              <TextField
                                dir="rtl"
                                className="w-full"
                                id="filled-basic"
                                label={dataKeysToHebrewName[key]}
                                name={key}
                                value={tfila[key as keyof Message]}
                                onChange={(e) =>
                                  handleInputArrayChange(e, idx, name)
                                }
                                variant="filled"
                              />
                            </div>
                          )
                        );
                      })}
                      <Button
                        onClick={(e) => removeObjectFromArray(name, idx)}
                        startIcon={<Delete />}
                      >
                        הסר
                      </Button>
                    </div>
                  ))}
                {(name === "tfilaTimes" ||
                  name === "messages" ||
                  name === "forMedicine" ||
                  name === "forUplifting") && (
                  <div>
                    <Button
                      onClick={() => addObjectToArray(name)}
                      variant="contained"
                    >
                      הוסף
                    </Button>
                  </div>
                )}
                {name === "boardBackgroundImage" && (
                  <div className="flex gap-1 w-full overflow-x-auto">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                      (item, index) => (
                        <div
                          onClick={() =>
                            setDbBoard({
                              ...dbBoard,
                              boardBackgroundImage: item,
                            })
                          }
                          key={index}
                          className="min-w-20 min-h-16"
                        >
                          <img
                            src={require("../assets/backgrounds/" +
                              item +
                              ".jpg")}
                            className={`min-w-20 min-h-16 rounded-md ${
                              item === dbBoard.boardBackgroundImage
                                ? "border-2 border-sky-500 border-spacing-1"
                                : ""
                            }`}
                            alt={item}
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
                {name === "mapBackgroundImage" && (
                  <div className="flex gap-1 w-full overflow-x-auto">
                    {beautyColorsHex.map((item: string, index) => (
                      <div
                        onClick={() =>
                          setDbBoard({
                            ...dbBoard,
                            boardBackgroundImage: item,
                          })
                        }
                        style={{ backgroundColor: `${item}` }}
                        key={index}
                        className="min-w-20 min-h-16 rounded-md"
                      ></div>
                    ))}
                  </div>
                )}
                {name === "timesToShow" && (
                  <div className="grid grid-cols-2">
                    {Object.keys(translationsZmanimKeys).map((key: string) => {
                      return (
                        <div>
                          {
                            <div>
                              <Checkbox
                                onClick={(e) =>
                                  handleTimesChange(
                                    key as keyof TranslationsZmanimKeys
                                  )
                                }
                                name={"isSaturdayTfila"}
                                checked={dbBoard.timesToShow.includes(
                                  key as keyof TranslationsZmanimKeys
                                )}
                              />
                              {
                                translationsZmanimKeys[
                                  key as keyof TranslationsZmanimKeys
                                ]
                              }{" "}
                            </div>
                          }
                        </div>
                      );
                    })}
                  </div>
                )}
                {name === "dateTypes" && (
                  <div className="flex ">
                    {Object.keys(dateToShow).map((key: string) => {
                      return (
                        <div>
                          {
                            <div>
                              <Checkbox
                                onClick={(e) => {
                                  if (
                                    dbBoard?.dateTypes.includes(
                                      key as keyof DateToShow
                                    )
                                  ) {
                                    let arr = dbBoard?.dateTypes.filter(
                                      (date) => date !== key
                                    );
                                    setDbBoard({
                                      ...dbBoard,
                                      dateTypes: arr,
                                    });
                                  } else {
                                    let arr = [...dbBoard?.dateTypes, key];

                                    setDbBoard({
                                      ...dbBoard,
                                      dateTypes: arr,
                                    });
                                  }
                                }}
                                name={"isSaturdayTfila"}
                                checked={dbBoard.dateTypes.includes(
                                  key as keyof DateToShow
                                )}
                              />
                              {dateToShow[key as keyof DateToShow]}
                            </div>
                          }
                        </div>
                      );
                    })}
                  </div>
                )}
                {name === "theme" && (
                  <div className="flex gap-1 flex-1">
                    {thems.map((them: { name: Theme; title: string }) => {
                      return (
                        <div
                          className={`w-20 h-12 cursor-pointer border-2 rounded-md flex items-center justify-center ${
                            dbBoard.theme === them.name
                              ? "bg-sky-400 text-white border-sky-400"
                              : "border-black"
                          }`}
                          onClick={() =>
                            setDbBoard({ ...dbBoard, theme: them.name })
                          }
                        >
                          {them.title}
                        </div>
                      );
                    })}
                  </div>
                )}
                {name === "boardTextColor" && (
                  <div className="flex gap-1 flex-1">
                    {boardTextColors.map(
                      (them: { name: string; title: string }) => {
                        return (
                          <div
                            className={`w-20 h-12 cursor-pointer border-2 rounded-md flex items-center justify-center ${
                              dbBoard.boardTextColor === them.name
                                ? "bg-sky-400 text-white border-sky-400"
                                : "border-black"
                            }`}
                            onClick={() =>
                              setDbBoard({
                                ...dbBoard,
                                boardTextColor: them.name,
                              })
                            }
                          >
                            {them.title}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="w-full flex justify-center gap-2 items-center my-3">
        <Button
          className="mobile-only:w-full w-28"
          variant="contained"
          onClick={() => updateBoard(id ?? "", dbBoard)}
        >
          עדכן לוח
        </Button>
        <Button
          className="mobile-only:w-full w-28"
          variant="contained"
          onClick={() => showBoard(id ?? "")}
        >
          להצגת הלוח
        </Button>
      </div>
      {/* <div className="w-full h-56">
        <Kboard board={dbBoard} zmanim={props.zmanim} parasha={props.parasha} />
      </div> */}

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
          הלוח עודכן בהצלחה!
        </Alert>
      </Snackbar>
    </div>
  );
}
export default EditBoard;

EditBoard.defaultProps = {
  parasha: "",
  zmanim: undefined,
};

interface Props {
  parasha: string;
  zmanim: Zman[] | undefined;
}
