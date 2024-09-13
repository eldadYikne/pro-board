import { createContext, useEffect, useRef, useState } from "react";
import {
  Board,
  InspirationalScreen,
  MenuLink,
  Message,
  ScreenType,
  ScreenTypeTypes,
  ShabatDayTfila,
  Tfila,
  Theme,
  YoutubeUrl,
} from "../types/board";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  Modal,
  Snackbar,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { EmojiObjectsOutlined } from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import { db } from "..";
import { Delete, Close, WhatsApp, Menu } from "@mui/icons-material";
import { DateToShow, dateToShow, translationsZmanimKeys } from "../utils/const";
import { TranslationsZmanimKeys, Zman } from "../types/zmanim";
import { UploadWidget } from "./UploadWidget";
import { generateRandomId } from "../utils/utils";
import { toPng } from "html-to-image";
import GoogleAuth from "./GoogleAuth";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import AdminNavbar from "./AdminNavbar";
import { updateBoardExceptUsers } from "../service/serviceBoard";
import Login from "./Login";
import YouTubeAudioPlayer from "./YouTubeAudioPlayer";
import YouTubeURLInput from "./YouTubeURLInput";
import NotAllowedEdit from "./NotAllowedEdit";
import FreezePage from "./FreezePage";
import ScreenPreview from "./ScreenPreview";

function SEditBoard(props: Props) {
  const [dbBoard, setDbBoard] = useState<Board>();
  const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>();
  const [imageUrl, setImageUrl] = useState("");
  const [screenEditorIsOpen, setScreenEditorIsOpen] = useState<boolean>(false);
  const [downloadTimesImgIsOpen, setDownloadTimesImgIsOpen] =
    useState<boolean>(false);
  const [screenTypeEdit, setScreenTypeEdit] = useState<ScreenTypeTypes>();
  const [editingScreen, setEditingScreen] = useState<ScreenType>();
  const elementRef = useRef(null);
  const [connectedUser, setConnectedUser] = useState<User>();
  const auth = getAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  // const ThemeContext = createContext('modern');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
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
      if (id) {
        console.log("id", id);
        await getBoardById(id);
      }
    }
    fetchData();
    return unsubscribe;
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
        console.log("newBoard", newBoard);
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

  const handleTimesChange = (time: keyof TranslationsZmanimKeys) => {
    let newArray;
    if (dbBoard?.timesToShow?.includes(time)) {
      newArray = dbBoard?.timesToShow?.filter((item) => item !== time);
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
  const screenTypes: ScreenType[] = [
    {
      type: "image",
      text: "תמונה",
      title: "",
      content: "",
      id: "",
      imgUrl: "",
    },
    {
      type: "images",
      text: "קולאז׳ תמונות",
      title: "",
      content: "",
      id: "",
      imgUrl: [],
    },
    { type: "info", text: "הידעת", title: "", content: "", id: "", imgUrl: "" },
    {
      id: "",
      type: "message",
      text: "הודעה",
      title: "נא לא לדבר בשעת התפילה!",
      content: "",
    },
    {
      type: "birthday",
      text: "איחולים",
      title: "",
      background: "birthday2",
      content: "",
      id: "",
    },
  ];
  const inputsBoard: { name: keyof Board; placeholder: string }[] = [
    { name: "boardName", placeholder: "שם בית הספר" },
    { name: "boardSymbol", placeholder: "סמל בית הספר" },
    { name: "screens", placeholder: "הוסף מסך" },
    // { name: "dateTypes", placeholder: "סוג תאריך" },
    { name: "messages", placeholder: "הודעות " },
    {
      name: "messageScreenIsWhatsapp",
      placeholder: "לוח הודעות מוצג בשיחת ווצאפ",
    },
    {
      name: "keyOfHeartsScreenActive",
      placeholder: "מסך מפתח הלב",
    },
    { name: "boardTextColor", placeholder: "צבע טקסט" },
    { name: "boardWelcomeImage", placeholder: "ברוכים הבאים" },
    {
      name: "inspirationalScreen",
      placeholder: "מסך משפטים מעוררי השראה",
    },
    { name: "youtubeUrl", placeholder: "שיר מתנגן ברקע" },

    // { name: "boardBackgroundImage", placeholder: "רקע ללוח" },
    // { name: "theme", placeholder: "ערכת נושא" },
  ];

  const boardTextColors: { name: string; title: string }[] = [
    { name: "black", title: "שחור" },
    { name: "white", title: "לבן" },
    { name: "auto", title: "אוטומטי" },
  ];

  const inspirationalScreenInputs: {
    key: keyof InspirationalScreen;
    placeholder: string;
  }[] = [
    { key: "text", placeholder: "משפט מעורר השראה" },
    { key: "writer", placeholder: "כותב/משורר" },
  ];
  const handleInputArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    arrayName: "tfilaTimes" | "forUplifting" | "forMedicine" | "messages",
    isBollean?: boolean
  ) => {
    const { name, value } = e.target;
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
    }
  };
  const onDeleteScreen = (screenToDelete: ScreenType) => {
    setScreenEditorIsOpen(false);
    console.log("screenToDelete", screenToDelete);
    if (screenToDelete.id) {
      const filterScreens = dbBoard?.screens.filter(
        (screen) => screen.id !== screenToDelete.id
      );
      if (dbBoard) {
        setDbBoard({
          ...dbBoard,
          screens: [...(filterScreens ?? [])],
        });
      }
    }
  };
  const handleAddScreen = () => {
    setScreenEditorIsOpen(false);
    let newScreen: ScreenType;
    console.log("editingScreen", editingScreen);
    if (editingScreen?.id) {
      handleEditScreen(editingScreen);
      return;
    }
    if (screenTypeEdit === "message" || screenTypeEdit === "birthday") {
      if (editingScreen?.content) {
        newScreen = {
          id: generateRandomId(),
          content: editingScreen.content,
          text: editingScreen.text,
          title: editingScreen.title,
          type: editingScreen.type,
          background: editingScreen.background,
        };
        if (dbBoard) {
          setDbBoard({
            ...dbBoard,
            screens: [...(dbBoard.screens ?? []), newScreen],
          });
        }
        // console.log(dbBoard?.screens);
      } else {
      }
    } else if (
      screenTypeEdit === "image" ||
      screenTypeEdit === "info" ||
      screenTypeEdit === "images"
    ) {
      if (editingScreen?.content || editingScreen?.imgUrl) {
        newScreen = {
          id: generateRandomId(),
          content: editingScreen?.content ?? "",
          text: "תמונה",
          title: editingScreen.title,
          imgUrl: editingScreen.imgUrl ?? "",
          type: screenTypeEdit,
        };
        if (dbBoard) {
          setDbBoard({
            ...dbBoard,
            screens: [...(dbBoard.screens ?? []), newScreen],
          });
        }
      }
    }
  };

  const handleOpenModalScreen = (screenType: ScreenTypeTypes) => {
    setScreenTypeEdit(screenType);
    console.log("screenType", screenType);
    if (screenType === "birthday") {
      setEditingScreen({
        id: "",
        content: "",
        text: "",
        title: "",
        type: screenType,
        background: "birthday2",
      });
    } else if (screenType === "images") {
      setEditingScreen({
        id: "",
        content: "",
        text: "",
        title: "",
        type: screenType,
        imgUrl: [],
      });
    } else {
      setEditingScreen({
        id: "",
        content: "",
        text: "",
        title: "",
        type: screenType,
        imgUrl: "",
      });
    }

    setScreenEditorIsOpen(true);
  };
  const handleEditScreen = (screenToEdit: ScreenType) => {
    const filterScreens = dbBoard?.screens.filter(
      (screen) => screen.id !== screenToEdit.id
    );
    if (dbBoard) {
      setDbBoard({
        ...dbBoard,
        screens: [...(filterScreens ?? []), screenToEdit],
      });
    }
  };
  const addObjectToArray = (
    arrayName: "tfilaTimes" | "forUplifting" | "forMedicine" | "messages",
    dayTfila?: ShabatDayTfila
  ) => {
    if (dbBoard && Array.isArray(dbBoard[arrayName])) {
      if (arrayName !== "tfilaTimes") {
        const addObjectToArray: Message[] | undefined = dbBoard[arrayName];
        let newItem: Message = { content: "", date: new Date() };
        addObjectToArray?.push(newItem);
        setDbBoard({
          ...dbBoard,
          [arrayName]: addObjectToArray,
        });
      } else if (arrayName === "tfilaTimes" && dayTfila) {
        const addObjectToArray: Tfila[] | undefined = dbBoard[arrayName];
        let newItem: Tfila = {
          day: dayTfila,
          name: "",
          time: "",
        };
        addObjectToArray?.push(newItem);
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
      // console.log("addObjectToArray", removeObjectToArray);
      setDbBoard({
        ...dbBoard,
        [arrayName]: removeObjectToArray,
      });
    }
  };
  const onDownloadTimesImg = () => {
    if (elementRef.current) {
      // console.log("download img");
      toPng(elementRef.current, {
        // cacheBust: false,
        // backgroundColor: "#f2d4b0",
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `${props?.parasha} - ${dbBoard?.boardName}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setTimeout(() => setDownloadTimesImgIsOpen(false), 1000);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    // console.log(name, ":", value);
    if (dbBoard) {
      setDbBoard({
        ...dbBoard,
        [name]: value,
      });
    }
  };
  const updateBoard = async (boardId: string, boardData: any) => {
    if (!boardId) return;
    // console.log(dbBoard);
    try {
      boardData.lastTimeBoardUpdate = new Date();
      await updateBoardExceptUsers(boardId, boardData); // Update the user document with new data
      console.log("BOARD updated successfully from editBoard!");
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
  const setEditScreenWithImagesArray = (imgUrl: string) => {
    if (
      editingScreen?.type === "images" &&
      editingScreen?.imgUrl &&
      Array.isArray(editingScreen.imgUrl)
    ) {
      setEditingScreen((prevState) => {
        return {
          ...prevState,
          imgUrl: [...(prevState?.imgUrl as string[]), imgUrl],
        } as ScreenType;
      });
    }
  };
  if (
    connectedUser?.email &&
    dbBoard?.admins &&
    !dbBoard?.admins.includes(connectedUser?.email)
  ) {
    return (
      <NotAllowedEdit
        setConnectedUser={setConnectedUser}
        connectedUser={connectedUser}
      />
    );
  }

  if (
    connectedUser &&
    connectedUser.email &&
    dbBoard?.admins.includes(connectedUser?.email) &&
    dbBoard?.isFreez
  ) {
    return <FreezePage connectedUser={connectedUser} />;
  }
  return (
    <div
      style={{
        background: connectedUser
          ? "00000017"
          : `url(${require(`../assets/edit-bg1.jpg`)})`,
        backgroundSize: "cover !importent",
      }}
      className=" flex flex-col gap-2 sm:justify-center sm:items-center sm:w-full "
    >
      <div className="w-full flex flex-col justify-center">
        {connectedUser ? (
          <AdminNavbar
            setConnectedUser={setConnectedUser}
            isSchoolBoard={true}
          />
        ) : (
          <Login
            boardName={dbBoard?.boardName ?? ""}
            setConnectedUser={setConnectedUser}
          />
        )}

        {connectedUser &&
          dbBoard &&
          connectedUser.email &&
          dbBoard.admins.includes(connectedUser.email) && (
            <div className=" pb-24  flex flex-col gap-2">
              <div className=" flex flex-col gap-2">
                {inputsBoard.map(({ name, placeholder }) => {
                  return (
                    <div
                      key={name}
                      className="flex flex-col gap-1 p-4 sm:px-14 "
                    >
                      {name !== "users" &&
                        name !== "tfilaTimes" &&
                        name !== "isSetShabatTime" && (
                          <span className="sm:text-xl font-['Nachlieli'] pb-2">
                            {placeholder}:
                          </span>
                        )}
                      {!Array.isArray(dbBoard[name]) &&
                        name !== "boardBackgroundImage" &&
                        name !== "boardWelcomeImage" &&
                        name !== "boardTextColor" &&
                        name !== "dateTypes" &&
                        name !== "inspirationalScreen" &&
                        name !== "boardSymbol" &&
                        name !== "screens" &&
                        name !== "youtubeUrl" &&
                        name !== "messageScreenIsWhatsapp" &&
                        name !== "keyOfHeartsScreenActive" &&
                        name !== "isSetShabatTime" &&
                        name !== "theme" && (
                          <TextField
                            disabled={name === "boardName"}
                            dir="rtl"
                            id="filled-basic"
                            label={placeholder}
                            value={dbBoard[name]}
                            name={name}
                            onChange={(e) => handleChange(e)}
                            variant="filled"
                          />
                        )}
                      {name === "boardSymbol" && (
                        <div className="flex flex-col justify-center items-center">
                          {dbBoard.boardSymbol && (
                            <img
                              className="h-32"
                              alt=""
                              src={dbBoard?.boardSymbol}
                            />
                          )}
                          <UploadWidget
                            text={
                              dbBoard.boardSymbol ? "החלף תמונה" : "הוסף תמונה"
                            }
                            onSetImageUrl={(e: string) =>
                              setDbBoard({
                                ...dbBoard,
                                boardSymbol: e,
                              })
                            }
                          />
                        </div>
                      )}
                      {name === "messages" &&
                        dbBoard[name]?.map((tfila: Message, idx) => (
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
                      {name === "messages" && (
                        <div>
                          <Button
                            onClick={() => addObjectToArray(name)}
                            variant="contained"
                          >
                            הוסף
                          </Button>
                        </div>
                      )}
                      {name === "boardWelcomeImage" && (
                        <div className="flex gap-1 w-full overflow-x-auto">
                          {[
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            "10",
                            "11",
                            "12",
                            "13",
                            "14",
                          ].map((item, index) => (
                            <div
                              onClick={() =>
                                setDbBoard({
                                  ...dbBoard,
                                  boardWelcomeImage: item,
                                })
                              }
                              key={index}
                            >
                              <img
                                src={require("../assets/school-backgrounds/" +
                                  item +
                                  ".jpg")}
                                className={` sm:min-w-[230px] sm:min-h-[200px]  min-w-20 min-h-16 rounded-md ${
                                  item === dbBoard.boardWelcomeImage
                                    ? "border-2 border-sky-500 border-spacing-1"
                                    : ""
                                }`}
                                alt={item}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {name === "timesToShow" && (
                        <div className="grid grid-cols-2">
                          {Object.keys(translationsZmanimKeys).map(
                            (key: string) => {
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
                                        checked={dbBoard.timesToShow?.includes(
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
                            }
                          )}
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
                                          let arr = [
                                            ...dbBoard?.dateTypes,
                                            key,
                                          ];

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
                      {(name === "messageScreenIsWhatsapp" ||
                        name === "keyOfHeartsScreenActive") && (
                        <div className="flex items-center ">
                          <Switch
                            onClick={(e) => {
                              setDbBoard({
                                ...dbBoard,
                                [name]: !dbBoard?.[name],
                              });
                            }}
                            name={name}
                            checked={dbBoard?.[name]}
                          />
                          <span>{dbBoard?.[name] ? "מופעל" : "כבוי"}</span>
                        </div>
                      )}
                      {name === "inspirationalScreen" && (
                        <div>
                          <div className="flex items-center ">
                            <Switch
                              onClick={(e) => {
                                setDbBoard({
                                  ...dbBoard,
                                  inspirationalScreen: {
                                    text:
                                      dbBoard?.inspirationalScreen?.text ?? "",
                                    writer:
                                      dbBoard?.inspirationalScreen?.writer ??
                                      "",
                                    isActive:
                                      !dbBoard?.inspirationalScreen?.isActive ??
                                      false,
                                  } as InspirationalScreen,
                                });
                              }}
                              name={"inspirationalScreen"}
                              checked={
                                dbBoard?.inspirationalScreen?.isActive ?? false
                              }
                            />
                            <span>
                              {dbBoard?.inspirationalScreen?.isActive
                                ? "מופעל"
                                : "כבוי"}
                            </span>
                          </div>

                          {dbBoard?.inspirationalScreen &&
                            dbBoard?.inspirationalScreen?.isActive && (
                              <div>
                                {dbBoard?.inspirationalScreen.isActive &&
                                  inspirationalScreenInputs.map(
                                    ({ key, placeholder }) => {
                                      return (
                                        <div>
                                          <TextField
                                            dir="rtl"
                                            className="w-full"
                                            id="filled-basic"
                                            label={placeholder}
                                            name={key}
                                            value={
                                              dbBoard?.inspirationalScreen[
                                                key as keyof InspirationalScreen
                                              ]
                                            }
                                            onChange={(e) =>
                                              setDbBoard({
                                                ...dbBoard,
                                                inspirationalScreen: {
                                                  ...dbBoard?.inspirationalScreen,
                                                  [key as keyof InspirationalScreen]:
                                                    e.target.value,
                                                },
                                              })
                                            }
                                            variant="filled"
                                          />
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            )}
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
                      {name === "screens" && (
                        <div className="flex flex-col">
                          <div className="flex gap-2 ">
                            {screenTypes.map((screen: ScreenType, index) => {
                              return (
                                <div
                                  className="shadow-lg text-center cursor-pointer bg-white rounded-lg flex items-center justify-center  w-20 h-16 "
                                  key={index}
                                  onClick={() =>
                                    handleOpenModalScreen(screen.type)
                                  }
                                >
                                  {screen.text}
                                </div>
                              );
                            })}
                          </div>
                          <Modal
                            open={screenEditorIsOpen}
                            onClose={() => setScreenEditorIsOpen(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Grid className="sm:w-[600px] w-[350px]" sx={style}>
                              <span className="text-center font-['Nachlieli'] text-lg text-black font-bold flex flex-col gap-2  sm:text-4xl">
                                <span>
                                  {screenTypes.find(
                                    (screenType) =>
                                      screenType.type === editingScreen?.type
                                  )?.text ?? ""}
                                </span>
                                <span>כך זה יראה</span>
                              </span>

                              {editingScreen && screenTypeEdit && (
                                <ScreenPreview
                                  screen={editingScreen}
                                  screenType={screenTypeEdit}
                                  onDeleteScreen={onDeleteScreen}
                                  handleAddScreen={handleAddScreen}
                                  setEditingScreen={setEditingScreen}
                                  setEditScreenWithImagesArray={
                                    setEditScreenWithImagesArray
                                  }
                                  dbBoard={dbBoard}
                                  isEditScreen={true}
                                />
                              )}
                            </Grid>
                          </Modal>
                          <div>
                            {dbBoard.screens && dbBoard.screens.length > 0 && (
                              <div>
                                <div className="font-['Nachlieli'] py-2 sm:text-xl">
                                  {" "}
                                  המסכים שלך :
                                </div>
                                <div className="flex gap-2 overflow-auto">
                                  {dbBoard.screens.map(
                                    (screen: ScreenType, index) => {
                                      return (
                                        <div
                                          onClick={() => {
                                            setEditingScreen(screen);
                                            setScreenEditorIsOpen(true);
                                            setScreenTypeEdit(screen.type);
                                          }}
                                          className="flex flex-col gap-2 cursor-pointer"
                                          key={index}
                                        >
                                          <ScreenPreview
                                            screen={screen}
                                            screenType={screen.type}
                                            onDeleteScreen={onDeleteScreen}
                                            handleAddScreen={handleAddScreen}
                                            setEditingScreen={setEditingScreen}
                                            setEditScreenWithImagesArray={
                                              setEditScreenWithImagesArray
                                            }
                                            dbBoard={dbBoard}
                                            isEditScreen={false}
                                          />
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {name === "youtubeUrl" && (
                        <div>
                          <div className="flex  items-center ">
                            <Switch
                              onClick={(e) => {
                                setDbBoard({
                                  ...dbBoard,
                                  youtubeUrl: {
                                    ...dbBoard.youtubeUrl,
                                    isActive:
                                      !dbBoard?.youtubeUrl?.isActive ?? false,
                                  } as YoutubeUrl,
                                });
                              }}
                              name={"youtubeUrl"}
                              checked={dbBoard?.youtubeUrl?.isActive ?? false}
                            />
                            <span>
                              {dbBoard?.youtubeUrl?.isActive ? "מופעל" : "כבוי"}
                            </span>
                          </div>
                          {dbBoard.youtubeUrl?.isActive && (
                            <YouTubeURLInput
                              value={dbBoard?.youtubeUrl?.youtubeId}
                              title={dbBoard.youtubeUrl.title ?? ""}
                              setYoutubeLink={(e: {
                                id: string;
                                title: string;
                              }) =>
                                setDbBoard({
                                  ...dbBoard,
                                  youtubeUrl: {
                                    title: e.title ?? "",
                                    youtubeId: e.id,
                                    isActive: true,
                                  },
                                })
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="w-full fixed  bottom-0 flex h-14  z-10  bg-white  justify-center gap-2 shadow-md items-center ">
                  <Button
                    className="mobile-only:w-3/4 w-36"
                    variant="contained"
                    onClick={() => updateBoard(id ?? "", dbBoard)}
                  >
                    עדכן לוח
                  </Button>
                </div>
              </div>
            </div>
          )}
      </div>
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
export default SEditBoard;

SEditBoard.defaultProps = {
  parasha: "",
  zmanim: undefined,
};

interface Props {
  parasha: string;
  zmanim: Zman[] | undefined;
  shabatTimes: { candles: string; havdalah: string };
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  minWidth: 350,
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "",
  boxShadow: 24,
  p: 6,
};
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
