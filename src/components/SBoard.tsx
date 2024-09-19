import { doc, onSnapshot } from "firebase/firestore";
import { Board, ScreenType, TimeObj } from "../types/board";
import { Zman } from "../types/zmanim";
import { db } from "..";
import { checkIsPast24Hours, checkIsPast3Hours } from "../utils/utils";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { Palette } from "color-thief-react";
import {
  KeyOfHeartScreen,
  getCurrentDateDayFirst,
  keyOfHeartScreens,
} from "../utils/const";
import { ReactComponent as ProBoard } from "../assets/pro-board-logo.svg";
import WhatsappMessages from "./WhatsappMessages";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import MessageIcon from "@mui/icons-material/Message";
import { dividerClasses } from "@mui/material";
import YouTubeAudioPlayer from "./YouTubeAudioPlayer";
import { updateActiveScreens } from "../service/serviceBoard";
import FreezePage from "./FreezePage";
import { Favorite } from "@mui/icons-material";
function Sboard(props: Props) {
  const [dbBoard, setDbBoard] = useState<Board>();
  const [colors, setColors] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [keyOfHeartScreen, setKeyOfHeartScreen] = useState<KeyOfHeartScreen>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenBackground, setScreenBackground] = useState<string>();
  const [timeBetweenScreens, setTimeBetweenScreens] = useState<number>(10000);
  const [defaultScreenActive, setDefaultScreenActive] = useState<
    Array<keyof Board | string>
  >(["boardName"]);
  enum STATIC_SCREEN_TYPES {
    WELCOME = 1,
    MESSAGES = 2,
    INSPIRATIONAL = 3,
    KEY_OF_HEART = 4,
  }
  const { id } = useParams();
  const [uniqueIdentifier, setUniqueIdentifier] = useState("");
  useEffect(() => {
    async function fetchData() {
      if (id) {
        console.log("id", id);
        await getBoardByIdSnap(id);
        setScreenBackground(dbBoard?.boardWelcomeImage ?? "1");
        // await updateTurnOffScreen();
        setStep(1);
      } else if (props.board) {
        setDbBoard(props.board);
      }
    }
    const hourlyInterval = setInterval(async () => {
      props.getTimesFromDb();
      const date = new Date(props.lastTimeDataUpdated);
      const isPast24Hours = checkIsPast24Hours(String(date));
      console.log(
        "checkifisTime24Past!",
        isPast24Hours,
        `${date.getHours()}:${date.getMinutes()}`
      );

      if (isPast24Hours) {
        console.log("isTime24Past!");
        props.getTimesFromDb();
      }
      findKeyHeartByCurrentMonth();
      await handleAndUpadteActiveScreens();
      await updateTurnOffScreen();
    }, 3600000);
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const intervalStep = setInterval(() => {
      let isHasMessagesScreen =
        dbBoard?.messages && dbBoard?.messages?.length > 0;
      let activeDefaultScreens = [
        "boardName", //WELCOME SCREEN
        isHasMessagesScreen ? "messages" : "",
        dbBoard?.inspirationalScreen?.isActive ? "inspirationalScreen" : "",
        dbBoard?.keyOfHeartsScreenActive ? "keyOfHeartsScreenActive" : "",
      ].filter((isScreen) => !!isScreen);
      console.log("array", activeDefaultScreens);
      let activeDefaultScreensNumber = activeDefaultScreens.length ?? 1;

      setDefaultScreenActive(activeDefaultScreens);

      let allScreensActiveNumber = 0;
      if (dbBoard?.screens && dbBoard?.screens.length > 0) {
        allScreensActiveNumber =
          activeDefaultScreensNumber + dbBoard?.screens.length;
      }

      console.log(activeDefaultScreens, "activeDefaultScreens");
      console.log(allScreensActiveNumber, "allScreensActiveNumber");
      setStep((prevStep) => {
        const updatedStep =
          prevStep >= allScreensActiveNumber ? 1 : prevStep + 1;
        console.log("step after update", updatedStep);
        switch (updatedStep) {
          case 1:
            setScreenBackground(dbBoard?.boardWelcomeImage ?? "");
            break;
          default:
            if (isHasMessagesScreen && updatedStep === 2) {
              setScreenBackground("white");
              break;
            }
            if (dbBoard?.inspirationalScreen?.isActive && updatedStep === 3) {
              setScreenBackground("inspirational");
              break;
            }
            if (dbBoard?.keyOfHeartsScreenActive && updatedStep === 4) {
              setScreenBackground("white");
              break;
            }
            if (
              updatedStep > activeDefaultScreensNumber &&
              dbBoard?.screens[updatedStep - activeDefaultScreensNumber - 1]
                ?.background
            ) {
              setScreenBackground(
                dbBoard?.screens[updatedStep - activeDefaultScreensNumber - 1]
                  ?.background ?? ""
              );
            } else {
              setScreenBackground("white");
            }
            break;
        }

        return updatedStep;
      });
    }, timeBetweenScreens);
    findKeyHeartByCurrentMonth();
    // Clear the interval when the component unmounts
    fetchData();
    const updateActiveBoard = async () => {
      await handleAndUpadteActiveScreens();
    };
    updateActiveBoard();
    return () => {
      clearInterval(hourlyInterval);
      clearInterval(intervalId);
      clearInterval(intervalStep);
    };
  }, [
    id,
    props.lastTimeDataUpdated,
    dbBoard?.screens.length,
    dbBoard?.inspirationalScreen?.isActive,
  ]);
  const findKeyHeartByCurrentMonth = () => {
    const currentMonth = new Date().getMonth() + 1;
    // const currentMonth = 4;
    const heartScreen = keyOfHeartScreens.find(
      (heartScreen) => heartScreen.gregorianDate === currentMonth
    );
    if (heartScreen) {
      setKeyOfHeartScreen(heartScreen);
    }
  };
  const updateTurnOffScreen = async () => {
    if (id && dbBoard) {
      const updatedScreensActive = [...dbBoard.activeScreens].filter(
        (activeScreen) => {
          const date = new Date(
            (activeScreen.date as TimeObj).seconds * 1000 +
              (activeScreen.date as TimeObj).nanoseconds / 1000000
          );
          if (checkIsPast3Hours(String(date))) {
            return false;
          }
          return true;
        }
      );
      console.log("updatedScreensActive", updatedScreensActive);
      await updateActiveScreens(id, updatedScreensActive);
    }
  };
  const handleAndUpadteActiveScreens = async () => {
    const fingerprint = [
      navigator.userAgent,
      navigator.platform,
      navigator.language,
      navigator.vendor,
      navigator.hardwareConcurrency,
      navigator.maxTouchPoints,
    ].join(" ");

    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      return hash;
    };
    if (!uniqueIdentifier) {
      setUniqueIdentifier(String(hashCode(fingerprint)));
    }
    console.log("activeScreens", id, dbBoard);
    if (id && dbBoard) {
      const existActiveScreen = dbBoard.activeScreens.find(
        (activeScreen) => activeScreen.id === uniqueIdentifier
      );
      console.log("existActiveScreen", existActiveScreen);
      if (existActiveScreen) {
        const filtersActiveScreens = dbBoard.activeScreens.filter(
          (activeScreen) => activeScreen.id !== existActiveScreen.id
        );

        await updateActiveScreens(id, [
          ...filtersActiveScreens,
          { id: existActiveScreen.id, date: new Date() },
        ]);
      } else {
        const newActiveScreen = { date: new Date(), id: uniqueIdentifier };
        console.log("existActiveScreen", newActiveScreen);

        await updateActiveScreens(id, [
          ...dbBoard.activeScreens,
          newActiveScreen,
        ]);
      }
    }
  };
  const setStepWithButton = () => {
    let isHasMessagesScreen =
      dbBoard?.messages && dbBoard?.messages?.length > 0;
    let activeDefaultScreens = [
      "boardName", //WELCOME SCREEN
      isHasMessagesScreen ? "messages" : "",
      dbBoard?.inspirationalScreen?.isActive ? "inspirationalScreen" : "",
      dbBoard?.keyOfHeartsScreenActive ? "keyOfHeartsScreenActive" : "",
    ].filter((isScreen) => !!isScreen);
    console.log("array", activeDefaultScreens);
    let activeDefaultScreensNumber = activeDefaultScreens.length ?? 1;
    console.log(activeDefaultScreensNumber, "activeDefaultScreensNumber");

    setDefaultScreenActive(activeDefaultScreens);

    let allScreensActiveNumber = 0;
    if (dbBoard?.screens && dbBoard?.screens.length > 0) {
      allScreensActiveNumber =
        activeDefaultScreensNumber + dbBoard?.screens.length;
    } else {
      allScreensActiveNumber = activeDefaultScreensNumber;
    }

    console.log(activeDefaultScreens, "activeDefaultScreens");
    console.log(allScreensActiveNumber, "allScreensActiveNumber");
    setStep((prevStep) => {
      const updatedStep = prevStep >= allScreensActiveNumber ? 1 : prevStep + 1;
      console.log("step after update", updatedStep);
      switch (updatedStep) {
        case 1:
          setScreenBackground(dbBoard?.boardWelcomeImage ?? "1");
          break;
        default:
          if (
            isHasMessagesScreen &&
            updatedStep === 2 &&
            activeDefaultScreensNumber >= updatedStep
          ) {
            setScreenBackground("white");
            break;
          }
          if (
            dbBoard?.inspirationalScreen?.isActive &&
            updatedStep === 3 &&
            activeDefaultScreensNumber >= updatedStep
          ) {
            setScreenBackground("inspirational");
            break;
          }
          if (
            dbBoard?.keyOfHeartsScreenActive &&
            updatedStep === 4 &&
            activeDefaultScreensNumber >= updatedStep
          ) {
            setScreenBackground("white");
            break;
          }
          if (
            updatedStep > activeDefaultScreensNumber &&
            dbBoard?.screens[updatedStep - activeDefaultScreensNumber - 1]
              ?.background
          ) {
            setScreenBackground(
              dbBoard?.screens[updatedStep - activeDefaultScreensNumber - 1]
                ?.background ?? ""
            );
          } else {
            setScreenBackground("white");
          }
          break;
      }

      return updatedStep;
    });
  };
  const getBoardByIdSnap = async (boardId: string) => {
    try {
      const boardRef = doc(db, "boards", boardId);

      // Listen to changes in the board document
      const unsubscribe = onSnapshot(boardRef, (boardDoc) => {
        if (boardDoc.exists()) {
          // Document exists, push its data into the array along with the ID
          const newBoard = { ...boardDoc.data(), id: boardDoc.id };
          if (newBoard.id) {
            setDbBoard(newBoard as Board);
          }

          // console.log(newBoard);
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
  if (dbBoard?.isFreez) {
    return <FreezePage baordName={dbBoard.boardName} />;
  }
  if (dbBoard?.type === "kodesh") {
    return (
      <div>
        <NotFoundPage />
      </div>
    );
  }
  return (
    <div>
      {/* <button onClick={setStepWithButton}>setStepWithButton - {step} </button>
      <span>screenBackground-{screenBackground}</span> */}
      {dbBoard && (
        <div
          style={{
            background: `url(${require(`../assets/school-backgrounds/${screenBackground}.jpg`)}) no-repeat`,
            backgroundSize: "cover !importent",
          }}
          className={`!bg-cover font-['Comix'] flex h-screen flex-col items-center justify-center p-3 w-full rounded-sm`}
        >
          <div className="flex flex-col h-full w-full items-center justify-center">
            {defaultScreenActive &&
              defaultScreenActive.length > 0 &&
              defaultScreenActive?.map((defaultScreen, index) => {
                return (
                  index + 1 === step && (
                    <div className="flex flex-col h-full w-full items-center justify-center">
                      {defaultScreen === "boardName" && (
                        <div
                          className="text-9xl overflow-hidden py-4 flex flex-col gap-2 items-center font-bold font-['Comix'] text-shadow-headline"
                          style={{
                            color:
                              dbBoard.boardTextColor === "auto"
                                ? colors[2]
                                : dbBoard.boardTextColor,
                          }}
                        >
                          <img
                            className="absolute top-6 left-6 h-52"
                            alt=""
                            src={dbBoard?.boardSymbol}
                            loading="lazy"
                          />
                          <span className="font-['Luizi']">ברוכים הבאים</span>
                          <span className="font-['Luizi']">
                            {" "}
                            {dbBoard.boardName}
                          </span>
                        </div>
                      )}
                      {defaultScreen === "messages" && (
                        <div className="h-full w-full p-6">
                          {dbBoard.messageScreenIsWhatsapp ? (
                            <WhatsappMessages
                              boardSymbol={dbBoard.boardSymbol ?? ""}
                              boardName={dbBoard.boardName ?? ""}
                              messages={dbBoard.messages ?? []}
                            />
                          ) : (
                            <div className="flex flex-col items-center h-full gap-16 justify-center">
                              <div className="flex gap-1 p-11 bg-blue-400 rounded-3xl items-center">
                                <span className="text-8xl  font-['Comix']">
                                  הודעות חשובות{" "}
                                </span>
                                <MessageIcon sx={{ fontSize: "5rem" }} />
                              </div>
                              <div className="flex flex-col gap-3">
                                {dbBoard.messages.length > 0 &&
                                  dbBoard.messages.map((message) => {
                                    return (
                                      <li
                                        style={{
                                          color: "black",
                                        }}
                                        className="font-['Comix'] font-light sm:text-4xl "
                                      >
                                        {message.content}
                                      </li>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {defaultScreen === "inspirationalScreen" && (
                        <div className="w-full gap-16 overflow-hidden h-full flex flex-col items-center justify-center">
                          <div className="flex gap-1 p-11 bg-yellow-300 rounded-3xl items-center">
                            <span className="text-8xl  font-['Comix']">
                              משפט מעורר השראה
                            </span>
                            <EmojiObjectsOutlinedIcon
                              sx={{ fontSize: "5rem" }}
                            />
                          </div>
                          <div className="w-full gap-4 text-center flex flex-col justify-center items-center">
                            <span className="text-8xl  font-['Comix']">
                              {dbBoard?.inspirationalScreen?.text}{" "}
                            </span>
                            <span className="text-5xl  font-['Comix']">
                              {dbBoard?.inspirationalScreen?.writer}{" "}
                            </span>
                          </div>
                        </div>
                      )}
                      {defaultScreen === "keyOfHeartsScreenActive" &&
                        keyOfHeartScreen && (
                          <div className="w-full gap-6 p-3 overflow-hidden flex-col h-full flex items-center justify-center">
                            <span className="text-8xl mb-6 rounded-3xl  p-5 bg-blue-300 font-['Comix']">
                              מפתח הלב
                              <Favorite fontSize="inherit" color="error" />
                            </span>
                            <div className="flex gap-4  items-center">
                              <span className="text-8xl rounded-3xl  p-5 bg-red-300 font-['Comix']">
                                {keyOfHeartScreen.title}
                              </span>
                              <span className="text-8xl   font-['Comix']">
                                -
                              </span>
                              <span className="text-8xl rounded-3xl  p-5 bg-yellow-300 font-['Comix']">
                                {keyOfHeartScreen.subtitle}
                              </span>
                              {/* <EmojiObjectsOutlinedIcon sx={{ fontSize: "5rem" }} /> */}
                            </div>
                            <div className="w-full gap-16 overflow-hidden  flex  items-center justify-center">
                              <div className="w-1/2 ">
                                <img
                                  className="w-1/2 h-1/2 rounded-md  border-black border-2 "
                                  src={keyOfHeartScreen.imageUrl}
                                  alt=""
                                  loading="lazy"
                                />
                              </div>

                              <div className=" gap-4 w-1/2 text-center flex flex-col justify-center items-center">
                                <span className="text-5xl  font-['Comix']">
                                  {keyOfHeartScreen.content}{" "}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  )
                );
              })}
            {dbBoard?.screens &&
              defaultScreenActive &&
              dbBoard.screens.length > 0 &&
              dbBoard.screens.map((screen: ScreenType, index: number) => {
                return (
                  step === index + defaultScreenActive.length + 1 && (
                    <div className="w-full overflow-hidden h-full flex flex-col items-center justify-center">
                      {(screen.type === "image" || screen.type === "info") &&
                        screen?.imgUrl &&
                        !Array.isArray(screen?.imgUrl) && (
                          <div className="flex h-full w-[90%] my-8 items-center justify-center flex-col gap-15 ">
                            {screen.type === "info" && (
                              <div className="flex gap-1 p-11 bg-yellow-300 rounded-3xl items-center">
                                <span className="text-8xl  font-['Comix']">
                                  הידעת
                                </span>
                                <EmojiObjectsOutlinedIcon
                                  sx={{ fontSize: "5rem" }}
                                />
                              </div>
                            )}
                            <div
                              dir="rtl"
                              className={`flex ${
                                screen.type === "image" ? "flex-col" : ""
                              } w-3/4 h-full items-center gap-7 justify-center text-center text-2xl font-['Comix']`}
                            >
                              <div className="flex flex-col max-w-[50%] gap-2">
                                <span className="text-7xl ">
                                  {screen?.title}
                                </span>
                                <span className="text-5xl ">
                                  {screen?.content}
                                </span>
                              </div>
                              <img
                                className="h-1/2"
                                alt=""
                                src={screen?.imgUrl}
                                loading="lazy"
                              />
                            </div>
                            {screen.type === "info" && (
                              <div className="absolute  top-[10%] right-[5%]  flex flex-col gap-32">
                                <div className=" bg-yellow-300 rounded-full h-[100px] w-[100px] "></div>
                                <div className=" bg-yellow-300 rounded-full h-[100px] w-[100px]    "></div>
                                <div className=" bg-yellow-300 rounded-full h-[100px] w-[100px]    "></div>
                              </div>
                            )}
                          </div>
                        )}
                      {screen.type === "images" &&
                        screen?.imgUrl &&
                        Array.isArray(screen?.imgUrl) && (
                          <div className="flex h-full w-full my-8 items-center justify-center flex-col gap-15 ">
                            <div
                              dir="rtl"
                              className={`flex flex-col w-[80%] h-full items-center gap-7 justify-center text-center text-2xl font-['Comix']`}
                            >
                              <div className="flex gap-1  flex-col text-6xl p-7 bg-purple-400 rounded-3xl items-center">
                                <span className="text-8xl  font-['Comix']">
                                  {screen.title}
                                </span>
                              </div>
                              <div
                                className={`grid gap-6 w-full  grid-cols-${
                                  screen.imgUrl.length < 3
                                    ? screen.imgUrl.length
                                    : 3
                                } justify-center`}
                              >
                                {Array.isArray(screen?.imgUrl) &&
                                  screen?.imgUrl.map((img: string) => {
                                    return (
                                      <img
                                        className="w-full h-full "
                                        alt=""
                                        src={img}
                                        loading="lazy"
                                      />
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        )}
                      {(screen.type === "message" ||
                        screen.type === "birthday") &&
                        screen?.content && (
                          <div
                            dir="rtl"
                            className="flex w-full items-center justify-center text-center text-8xl font-['Comix']"
                          >
                            {screen?.content}
                          </div>
                        )}
                    </div>
                  )
                );
              })}
          </div>
        </div>
      )}
      {dbBoard &&
        dbBoard?.youtubeUrl?.isActive &&
        dbBoard?.youtubeUrl?.youtubeId && (
          <YouTubeAudioPlayer videoId={dbBoard?.youtubeUrl?.youtubeId} />
        )}

      {dbBoard && (
        <React.Fragment>
          <Palette
            src={require("../assets/school-backgrounds/" +
              dbBoard.boardBackgroundImage +
              ".jpg")}
            crossOrigin="anonymous"
            format="hex"
            colorCount={4}
          >
            {({ data, loading }) => {
              if (loading) return <div>loading...</div>;
              if (data) setColors(data);
            }}
          </Palette>
        </React.Fragment>
      )}
    </div>
  );
}

export default Sboard;

Sboard.defaultProps = {
  parasha: "",
  zmanim: undefined,
  // isMoridHatal: false,
  omerDays: "",
  hebrewDate: "",
  roshChodesh: "",
  holiday: "",
  lastTimeDataUpdated: 0,
  getTimesFromDb: () => {},
};

interface Props {
  parasha: string;
  omerDays?: string;
  zmanim: Zman[] | undefined;
  board?: Board;
  // isMoridHatal: boolean;
  hebrewDate: string;
  roshChodesh: string;
  holiday: string;
  lastTimeDataUpdated: number;
  getTimesFromDb: Function;
}
