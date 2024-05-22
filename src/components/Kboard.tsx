import { TranslationsZmanimKeys, Zman } from "../types/zmanim";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "..";
import {
  Board,
  ScreenType,
  ShabatTimesToEdit,
  Tfila,
  TimeObj,
} from "../types/board";
import {
  OmerDay,
  getCurrentDate,
  getCurrentDateDayFirst,
  getCurrentDateNoYear,
  translationsZmanimKeys,
} from "../utils/const";
import Color, { Palette } from "color-thief-react";
import KboardTimes from "./KboardTimes";
import { checkIsPast24Hours } from "../utils/utils";

function Kboard(props: Props) {
  const [dbBoard, setDbBoard] = useState<Board>();
  const [colors, setColors] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hebrewDate, setHebrewDate] = useState("");
  const [timeBetweenScreens, setTimeBetweenScreens] = useState<number>(
    // dbBoard?.timeScreenPass ? Number(dbBoard?.timeScreenPass) * 1000 : 10000
    20000
    // 5000
  );

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

      // const { seconds, nanoseconds } = props.lastTimeDataUpdated;
      // const milliseconds = seconds * 1000 + nanoseconds / 1000000;
      const date = new Date(props.lastTimeDataUpdated);
      const isPast24Hours = checkIsPast24Hours(String(date));
      console.log(
        "checkifisTime24Past!",
        isPast24Hours,
        ` ${date.getHours()}:${date.getMinutes()}`
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
      let number = dbBoard?.theme === "modern" ? 2 : 1;
      if (dbBoard?.screens && dbBoard?.screens.length > 0) {
        number = number + dbBoard?.screens.length;
      }
      setStep((prevStep) => (prevStep === number ? 0 : prevStep + 1));
    }, timeBetweenScreens);

    // Clear the interval when the component unmounts
    fetchData();
    return () => {
      clearInterval(hourlyInterval);

      clearInterval(intervalId);
      clearInterval(intervalStep);
    };
  }, [id, props.lastTimeDataUpdated, dbBoard?.theme]);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  // Ensure minutes are displayed with leading zero if less than 10
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

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
            if (Number(dbBoard?.timeScreenPass) * 1000 !== timeBetweenScreens) {
              // setTimeBetweenScreens(
              //   Number(dbBoard?.timeScreenPass) * 1000 ?? 10000
              // );
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
  const shabatTimesToEdit: ShabatTimesToEdit[] = [
    { type: "weekday", name: "יום חול" },
    { type: "friday", name: " ערב שבת" },
    { type: "saturday", name: " שבת" },
  ];
  return (
    <div>
      {dbBoard && (
        <div
          style={{
            background: `url(${require("../assets/backgrounds/" +
              dbBoard.boardBackgroundImage +
              ".jpg")}) no-repeat`,
            backgroundSize: "cover !importent",
          }}
          className={`!bg-cover flex h-screen flex-col items-center justify-center p-3 w-full rounded-sm ${
            step === 0 ? "flip-image" : ""
          }`}
        >
          <div
            className={`flex flex-col gap-4 h-full w-full items-center justify-center ${
              step === 0 ? "flip-image" : ""
            }`}
          >
            <div className="flex flex-col gap-4 h-full w-full items-center justify-center">
              {step <= 1 && (
                <div
                  className="sm:text-8xl py-4 font-bold font-['Yiddish'] text-shadow-headline"
                  style={{
                    color:
                      dbBoard.boardTextColor === "auto" ? colors[2] : "black",
                  }}
                >
                  {dbBoard.boardName}
                </div>
              )}
              {/* {dbBoard.theme === "modern" && (
                <div className="flex gap-6 w-[80%] min-h-[65%]">
                  <div className="w-1/2">
                    <KboardTimes
                      board={dbBoard}
                      formattedMinutes={formattedMinutes}
                      hours={hours}
                      colors={colors}
                      hebrewDate={props.hebrewDate}
                      isMoridHatal={props.isMoridHatal}
                      parasha={props.parasha}
                      zmanim={props.zmanim}
                      omerDays={props.omerDays}
                      roshChodesh={props.roshChodesh}
                      holiday={props.holiday}
                      boardTextColor={dbBoard.boardTextColor}
                    />
                  </div>
                  <div className="backdrop-opacity-10 rounded-md backdrop-invert bg-white/50 h-full sm:w-1/2   flex flex-col p-6 ">
                    <div
                      className=" py-2 font-['Yiddish']  sm:text-5xl text-amber-600-600/75"
                      style={{
                        color:
                          dbBoard.boardTextColor === "auto"
                            ? colors[1]
                            : "black",
                      }}
                    >
                      {step === 0
                        ? " זמני היום"
                        : step === 1
                        ? "זמני תפילות"
                        : "הודעות לציבור"}
                    </div>
                    <div className="flex flex-col ">
                      {step === 0 && (
                        <div className="grid gap-2 xl:grid-cols-3 sm:grid-cols-2 ">
                          {dbBoard.timesToShow.map((time: string) => (
                            <div className="flex flex-col">
                              <span
                                className="font-['Suez'] underline font-light text-4xl"
                                style={{
                                  color:
                                    dbBoard.boardTextColor === "auto"
                                      ? colors[2]
                                      : "black",
                                }}
                              >
                                {time.includes("tzeit")
                                  ? "צאת הכוכבים"
                                  : translationsZmanimKeys[
                                      time as keyof TranslationsZmanimKeys
                                    ]}
                              </span>
                              <span
                                style={{
                                  color:
                                    dbBoard.boardTextColor === "auto"
                                      ? colors[2]
                                      : "black",
                                }}
                                className="font-['Alef'] text-4xl [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)]"
                              >
                                {props.zmanim?.find(
                                  (zman) =>
                                    zman.name ===
                                    translationsZmanimKeys[
                                      time as keyof TranslationsZmanimKeys
                                    ]
                                )?.time ?? ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {step === 1 && (
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col">
                            {shabatTimesToEdit.map((time) => {
                              return (
                                <div>
                                  <div
                                    className="font-bold underline py-2 font-['Alef'] sm:text-3xl text-amber-600-600/75"
                                    style={{
                                      color:
                                        dbBoard.boardTextColor === "auto"
                                          ? colors[1]
                                          : "black",
                                    }}
                                  >
                                    {time.name}
                                  </div>
                                  <div className="grid gap-2 xl:grid-cols-3 sm:grid-cols-2 ">
                                    {dbBoard.tfilaTimes.map((tfila: Tfila) => {
                                      return (
                                        time.type === tfila.day && (
                                          <div>
                                            <div
                                              style={{
                                                color:
                                                  dbBoard.boardTextColor ===
                                                  "auto"
                                                    ? colors[2]
                                                    : "black",
                                              }}
                                              className="font-['Suez']  font-bold sm:text-4xl"
                                            >
                                              {tfila.name}{" "}
                                            </div>
                                            <div
                                              style={{
                                                color:
                                                  dbBoard.boardTextColor ===
                                                  "auto"
                                                    ? colors[2]
                                                    : "black",
                                              }}
                                              className="font-['Alef'] sm:text-4xl [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)]"
                                            >
                                              {tfila.time}
                                            </div>
                                          </div>
                                        )
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {step === 2 && (
                        <ul className="flex flex-col gap-5">
                          {dbBoard.messages.length > 0 &&
                            dbBoard.messages.map((message) => {
                              return (
                                <li
                                  style={{
                                    color:
                                      dbBoard.boardTextColor === "auto"
                                        ? colors[2]
                                        : "black",
                                  }}
                                  className="font-['Alef'] font-light sm:text-4xl "
                                >
                                  - {message.content}
                                </li>
                              );
                            })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )} */}
              {dbBoard.theme === "column" && step <= 1 && (
                <div className="flex gap-6 w-[90%] h-[75%]">
                  {
                    <div className="backdrop-opacity-10 rounded-md backdrop-invert bg-white/50 h-full sm:min-w-[33%] w-full  flex flex-col p-6 ">
                      <div
                        className=" py-2 font-['Yiddish'] w-full flex justify-center sm:text-6xl text-amber-600-600/75"
                        style={{
                          color:
                            dbBoard.boardTextColor === "auto"
                              ? colors[1]
                              : "black",
                        }}
                      >
                        {step === 0 ? " זמני תפילות יום חול" : "הודעות לציבור"}
                      </div>

                      {step === 0 && (
                        <div className="flex flex-col py-6 ">
                          <div
                            className="flex flex-col gap-2 items-center justify-center "
                            style={{
                              gridTemplateColumns: "repeat(2, minmax(0, 1fr)) ",
                            }}
                          >
                            {dbBoard.tfilaTimes.map((tfila: Tfila) => {
                              return tfila.day === "weekday" ? (
                                <div className="flex justify-between w-full">
                                  <div
                                    style={{
                                      color:
                                        dbBoard.boardTextColor === "auto"
                                          ? colors[2]
                                          : "black",
                                    }}
                                    className="font-['Suez']  sm:text-4xl"
                                  >
                                    {tfila.name}{" "}
                                  </div>
                                  <div
                                    style={{
                                      color:
                                        dbBoard.boardTextColor === "auto"
                                          ? colors[2]
                                          : "black",
                                    }}
                                    className="font-['Alef'] sm:text-4xl [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)]"
                                  >
                                    {tfila.time}
                                  </div>
                                </div>
                              ) : (
                                <span className="hidden"></span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {step === 1 && (
                        <ul className="flex flex-col gap-5">
                          {dbBoard.messages.length > 0 &&
                            dbBoard.messages.map((message) => {
                              return (
                                <li
                                  style={{
                                    color:
                                      dbBoard.boardTextColor === "auto"
                                        ? colors[2]
                                        : "black",
                                  }}
                                  className="font-['Alef'] font-light sm:text-4xl "
                                >
                                  - {message.content}
                                </li>
                              );
                            })}
                        </ul>
                      )}
                    </div>
                  }

                  <KboardTimes
                    board={dbBoard}
                    formattedMinutes={formattedMinutes}
                    hours={hours}
                    colors={colors}
                    hebrewDate={props.hebrewDate}
                    isMoridHatal={props.isMoridHatal}
                    parasha={props.parasha}
                    zmanim={props.zmanim}
                    omerDays={props.omerDays}
                    roshChodesh={props.roshChodesh}
                    holiday={props.holiday}
                    boardTextColor={dbBoard.boardTextColor}
                    dateTypes={dbBoard.dateTypes}
                  />

                  <div className="backdrop-opacity-10 rounded-md backdrop-invert bg-white/50 h-full sm:min-w-[33%] w-full  flex flex-col p-6 ">
                    <div
                      className={`py-2 font-['Yiddish'] sm:text-6xl text-amber-600-600/75 w-full flex justify-center`}
                      style={{
                        color:
                          dbBoard.boardTextColor === "auto"
                            ? colors[1]
                            : "black",
                      }}
                    >
                      {step === 0
                        ? "זמני תפילות שבת"
                        : step === 1
                        ? " זמני היום"
                        : "הודעות לציבור"}
                    </div>
                    <div className="flex flex-col ">
                      {step === 1 && (
                        <div className="flex flex-col gap-2 ">
                          {dbBoard.timesToShow.map((time: string) => (
                            <div className="flex w-full justify-between ">
                              <span
                                className="font-['Suez'] font-light text-3xl"
                                style={{
                                  color:
                                    dbBoard.boardTextColor === "auto"
                                      ? colors[2]
                                      : "black",
                                }}
                              >
                                {time.includes("tzeit")
                                  ? "צאת הכוכבים"
                                  : translationsZmanimKeys[
                                      time as keyof TranslationsZmanimKeys
                                    ]}
                              </span>
                              <span
                                style={{
                                  color:
                                    dbBoard.boardTextColor === "auto"
                                      ? colors[2]
                                      : "black",
                                }}
                                className="font-['Alef'] text-3xl [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)]"
                              >
                                {props.zmanim?.find(
                                  (zman) =>
                                    zman.name ===
                                    translationsZmanimKeys[
                                      time as keyof TranslationsZmanimKeys
                                    ]
                                )?.time ?? ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {step === 0 && (
                        <div className="flex ">
                          <div className="flex flex-col gap-4  py-5  ">
                            {shabatTimesToEdit.map((time) => {
                              return (
                                time.type !== "weekday" && (
                                  <div>
                                    <div
                                      style={{
                                        color:
                                          dbBoard.boardTextColor === "auto"
                                            ? colors[2]
                                            : "black",
                                      }}
                                      className="font-['Alef'] underline font-light sm:text-4xl"
                                    >
                                      {time.name}{" "}
                                    </div>
                                    <div
                                      className="flex flex-col  gap-2  "
                                      style={{
                                        gridTemplateColumns:
                                          "repeat(2, minmax(0, 1fr)) ",
                                      }}
                                    >
                                      {dbBoard.tfilaTimes.map(
                                        (tfila: Tfila) => {
                                          return (
                                            time.type === tfila.day && (
                                              <div className="flex w-full justify-between gap-2">
                                                <div
                                                  style={{
                                                    color:
                                                      dbBoard.boardTextColor ===
                                                      "auto"
                                                        ? colors[2]
                                                        : "black",
                                                  }}
                                                  className="font-['Suez']   sm:text-3xl"
                                                >
                                                  {tfila.name}
                                                </div>
                                                <div
                                                  style={{
                                                    color:
                                                      dbBoard.boardTextColor ===
                                                      "auto"
                                                        ? colors[2]
                                                        : "black",
                                                  }}
                                                  className="font-['Alef'] sm:text-4xl [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)]"
                                                >
                                                  {tfila.time}
                                                </div>
                                              </div>
                                            )
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                )
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {dbBoard?.screens &&
              dbBoard.screens.length > 0 &&
              dbBoard.screens.map((screen: ScreenType, index: number) => {
                return (
                  step === index + 2 && (
                    <div className="w-full h-full items-center justify-center">
                      {screen.type === "image" && screen?.content && (
                        <div
                          dir="rtl"
                          className="flex flex-col h-full items-center justify-center text-center text-4xl font-['David'] image-screen"
                        >
                          <span>{screen?.title}</span>
                          <img className="" alt="" src={screen?.content} />
                        </div>
                      )}
                      {screen.type === "message" && screen?.content && (
                        <div
                          dir="rtl"
                          className="flex w-full items-center justify-center text-center text-6xl font-['David']"
                        >
                          {screen?.content}
                        </div>
                      )}
                    </div>
                  )
                );
              })}
            {dbBoard.forUplifting.length > 0 && (
              <div id="scroll-container">
                {dbBoard.forUplifting.length > 5 ? (
                  <div className="flex flex-col justify-center items-center font-['Alef']  w-full font-light sm:text-2xl  gap-1">
                    <span>לעילוי נשמת </span>
                    <div id="scroll-text" className="">
                      <div className="flex">
                        {dbBoard.forUplifting.map((forUplift, index) => {
                          return (
                            <div className="">
                              {" "}
                              {forUplift.content}{" "}
                              {dbBoard.forUplifting.length > 1
                                ? index === dbBoard.forUplifting.length - 1
                                  ? "."
                                  : ","
                                : ""}{" "}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="font-['Alef'] justify-center items-center w-full font-light sm:text-2xl flex gap-1">
                    לע״נ
                    {dbBoard.forUplifting.map((forUplift, index) => {
                      return (
                        <div>
                          {" "}
                          {forUplift.content}{" "}
                          {dbBoard.forUplifting.length > 1
                            ? index === dbBoard.forUplifting.length - 1
                              ? "."
                              : ","
                            : ""}{" "}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {dbBoard && (
        <Palette
          src={require("../assets/backgrounds/" +
            dbBoard.boardBackgroundImage +
            ".jpg")}
          crossOrigin="anonymous"
          format="hex"
          colorCount={4}
        >
          {({ data, loading }) => {
            if (loading) return <div>loading...</div>;
            if (data) setColors(data);
            // return (
            //   <div>
            //     Palette:
            //     <ul>
            //       {data &&
            //         data?.map((color, index) => (
            //           <li key={index} style={{ color: color }}>
            //             <strong>{color}</strong>
            //           </li>
            //         ))}
            //     </ul>
            //   </div>
            // );
          }}
        </Palette>
      )}
    </div>
  );
}
export default Kboard;

Kboard.defaultProps = {
  parasha: "",
  zmanim: undefined,
  isMoridHatal: false,
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
  isMoridHatal: boolean;
  hebrewDate: string;
  roshChodesh: string;
  holiday: string;
  lastTimeDataUpdated: number;
  getTimesFromDb: Function;
}
