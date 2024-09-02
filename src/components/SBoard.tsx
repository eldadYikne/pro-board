import { doc, onSnapshot } from "firebase/firestore";
import { Board, ScreenType, TimeObj } from "../types/board";
import { Zman } from "../types/zmanim";
import { db } from "..";
import { checkIsPast24Hours } from "../utils/utils";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { Palette } from "color-thief-react";
import { getCurrentDateDayFirst } from "../utils/const";
import { ReactComponent as ProBoard } from "../assets/pro-board-logo.svg";
import WhatsappMessages from "./WhatsappMessages";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import MessageIcon from "@mui/icons-material/Message";
import { dividerClasses } from "@mui/material";
function Sboard(props: Props) {
  const [dbBoard, setDbBoard] = useState<Board>();
  const [colors, setColors] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [isBgBlur, setIsBgBlur] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenBackground, setScreenBackground] = useState<string>(
    dbBoard?.boardWelcomeImage ?? "1"
  );
  const [timeBetweenScreens, setTimeBetweenScreens] = useState<number>(3000);

  const { id } = useParams();
  useEffect(() => {
    async function fetchData() {
      if (id) {
        console.log("id", id);
        await getBoardByIdSnap(id);
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
    }, 3600000);
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const intervalStep = setInterval(() => {
      //   let number = dbBoard?.inspirationalScreen?.isActive ? 2 : 1;
      //   let defaultNumberOfPages = dbBoard?.inspirationalScreen?.isActive ? 2 : 1;
      //   if (dbBoard?.screens && dbBoard?.screens.length > 0) {
      //     number = number + dbBoard?.screens.length;
      //   }
      //   console.log(number, "number");
      //   setStep((prevStep) => {
      //     const updatedStep = prevStep >= number ? 0 : prevStep + 1;
      //     console.log("step after update", updatedStep);
      //     switch (updatedStep) {
      //       case 0:
      //         setScreenBackground(dbBoard?.boardWelcomeImage ?? "");
      //         break;
      //       default:
      //         if (dbBoard?.inspirationalScreen?.isActive && updatedStep === 2) {
      //           setScreenBackground("inspirational");
      //           break;
      //         }
      //         if (
      //           updatedStep >= defaultNumberOfPages + 1 &&
      //           dbBoard?.screens[updatedStep - (defaultNumberOfPages + 1)]
      //             ?.background
      //         ) {
      //           // console.log("enter to herrrrrrrr");
      //           setScreenBackground(
      //             dbBoard?.screens[updatedStep - (defaultNumberOfPages + 1)]
      //               ?.background ?? ""
      //           );
      //         } else {
      //           // console.log("enter to white");
      //           // console.log(
      //           //   "enter to white",
      //           //   dbBoard?.screens[updatedStep - (defaultNumberOfPages + 1)]
      //           //     ?.background
      //           // );
      //           setScreenBackground("white");
      //         }
      //         break;
      //     }
      //     return updatedStep;
      //   });
    }, timeBetweenScreens);

    // Clear the interval when the component unmounts
    fetchData();
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

  const setStepWithButton = () => {
    let number = dbBoard?.inspirationalScreen?.isActive ? 2 : 1;
    let defaultNumberOfPages = dbBoard?.inspirationalScreen?.isActive ? 2 : 1;
    if (dbBoard?.screens && dbBoard?.screens.length > 0) {
      number = number + dbBoard?.screens.length;
    }
    console.log(number, "number");
    setStep((prevStep) => {
      const updatedStep = prevStep >= number ? 0 : prevStep + 1;
      console.log("step after update", updatedStep);
      switch (updatedStep) {
        case 0:
          setScreenBackground(dbBoard?.boardWelcomeImage ?? "");
          break;

        default:
          if (dbBoard?.inspirationalScreen?.isActive && updatedStep === 2) {
            setScreenBackground("inspirational");
            break;
          }
          if (
            updatedStep >= defaultNumberOfPages + 1 &&
            dbBoard?.screens[updatedStep - (defaultNumberOfPages + 1)]
              ?.background
          ) {
            // console.log("enter to herrrrrrrr");
            setScreenBackground(
              dbBoard?.screens[updatedStep - (defaultNumberOfPages + 1)]
                ?.background ?? ""
            );
          } else {
            // console.log("enter to white");
            // console.log(
            //   "enter to white",
            //   dbBoard?.screens[updatedStep - (defaultNumberOfPages + 1)]
            //     ?.background
            // );

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

          console.log(newBoard);
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

  if (dbBoard?.type === "kodesh") {
    return (
      <div>
        <NotFoundPage />
      </div>
    );
  }
  return (
    <div>
      {dbBoard && (
        <div
          style={{
            background: `url(${require(`../assets/school-backgrounds/${screenBackground}.jpg`)}) no-repeat`,
            backgroundSize: "cover !importent",
          }}
          //   style={{
          //     background: `url(${require(`../assets/school-backgrounds/${
          //       screenBackground !== ""
          //         ? screenBackground
          //         : step === 0
          //         ? dbBoard?.boardWelcomeImage
          //         : step === 1 && dbBoard.messages.length > 0
          //         ? "white"
          //         : step > 1 && dbBoard.screens.length > 0
          //         ? "white"
          //         : dbBoard?.boardWelcomeImage
          //     }.jpg`)}) no-repeat`,
          //     backgroundSize: "cover !importent",
          //   }}
          className={`!bg-cover flex h-screen flex-col items-center justify-center p-3 w-full rounded-sm`}
        >
          <span onClick={setStepWithButton}>{step}- step++</span>

          {/* {dbBoard.dateTypes.length > 0 && (
            <div className="text-3xl p-2 px-4 flex justify-between w-full font-['Anka'] items-center absolute top-0">
              <span className="text-3xl  ">
                {dbBoard.dateTypes.includes("hebrew") && (
                  <span> בס״ד {props.hebrewDate}</span>
                )}
              </span>
              <span onClick={setStepWithButton}>step++</span>

              <span className="text-3xl ">
                {dbBoard.dateTypes.includes("number") && (
                  <span>{getCurrentDateDayFirst()}</span>
                )}
              </span>
            </div>
          )} */}
          <div className="flex flex-col h-full w-full items-center justify-center">
            {(step <= 0 || (step === 1 && dbBoard.messages.length === 0)) && (
              <div
                className="text-9xl overflow-hidden py-4 flex flex-col gap-2 items-center font-bold font-['Comix'] text-shadow-headline"
                style={{
                  color:
                    dbBoard.boardTextColor === "auto" ? colors[2] : "black",
                }}
              >
                <img
                  className="absolute top-6 left-6 h-52"
                  alt=""
                  src={dbBoard?.boardSymbol}
                />
                <span>ברוכים הבאים</span>
                <span>{dbBoard.boardName}</span>
              </div>
            )}
            {dbBoard.messages.length > 0 && step === 1 && (
              <div className="h-full w-full">
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
                              className="font-['Alef'] font-light sm:text-4xl "
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
            {dbBoard?.inspirationalScreen?.isActive && step === 2 && (
              <div className="w-full gap-16 overflow-hidden h-full flex flex-col items-center justify-center">
                <div className="flex gap-1 p-11 bg-yellow-300 rounded-3xl items-center">
                  <span className="text-8xl  font-['Comix']">
                    משפט מעורר השראה
                  </span>
                  <EmojiObjectsOutlinedIcon sx={{ fontSize: "5rem" }} />
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
            {dbBoard?.screens &&
              dbBoard.screens.length > 0 &&
              dbBoard.screens.map((screen: ScreenType, index: number) => {
                return (
                  step ===
                    index +
                      (dbBoard?.inspirationalScreen?.isActive ? 3 : 2) && (
                    <div className="w-full overflow-hidden h-full flex flex-col items-center justify-center">
                      {(screen.type === "image" || screen.type === "info") &&
                        screen?.imgUrl &&
                        !Array.isArray(screen?.imgUrl) && (
                          <div className="flex h-full my-8 items-center justify-center flex-col gap-15 ">
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
                              />
                            </div>
                            {/* <div className=" bg-yellow-300 rounded-full z-0 h-[400px] w-[400px] absolute bottom-[10%] left-[10%] "></div> */}
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
                          <div className="flex h-full my-8 items-center justify-center flex-col gap-15 ">
                            <div
                              dir="rtl"
                              className={`flex flex-col w-full h-full items-center gap-7 justify-center text-center text-2xl font-['Comix']`}
                            >
                              <div className="flex gap-1  flex-col text-7xl p-11 bg-purple-400 rounded-3xl items-center">
                                <span className="text-8xl  font-['Comix']">
                                  {screen.title}
                                </span>
                              </div>
                              <div
                                className={`grid gap-6 grid-cols-${
                                  screen.imgUrl.length < 3
                                    ? screen.imgUrl.length
                                    : 3
                                } justify-center`}
                              >
                                {Array.isArray(screen?.imgUrl) &&
                                  screen?.imgUrl.map((img: string) => {
                                    return (
                                      <div className="h-full w-full flex flex-col relative">
                                        <img
                                          className="w-full h-full "
                                          alt=""
                                          src={img}
                                        />
                                      </div>
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
                            className="flex w-full items-center justify-center text-center text-8xl font-['David']"
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
      {dbBoard && (
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
