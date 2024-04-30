import { TranslationsZmanimKeys, Zman } from "../types/zmanim";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "..";
import { Board, Tfila } from "../types/board";
import { translationsZmanimKeys } from "../utils/const";
import Color, { Palette } from "color-thief-react";

function Kboard(props: Props) {
  const [dbBoard, setDbBoard] = useState<Board>();
  const [colors, setColors] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hebrewDate, setHebrewDate] = useState("");
  const [timeBetweenScreens, setTimeBetweenScreens] = useState(
    dbBoard?.timeScreenPass ? Number(dbBoard?.timeScreenPass) * 1000 : 10000
  );
  const getHebrewDay = (day: number) => {
    console.log("day", day);
    const hebrewDays = [
      "א",
      "ב",
      "ג",
      "ד",
      "ה",
      "ו",
      "ז",
      "ח",
      "ט",
      "י",
      "יא",
      "יב",
      "יג",
      "יד",
      "טו",
      "טז",
      "יז",
      "יח",
      "יט",
      "כ",
      "כא",
      "כב",
      "כג",
      "כד",
      "כה",
      "כו",
      "כז",
      "כח",
      "כט",
      "ל",
    ];
    return hebrewDays[day - 1];
  };
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

    const updateHebrewDate = () => {
      const currentDate = new Date();
      const options = {
        year: "numeric" as const,
        month: "long" as const,
        day: "2-digit" as const,
        calendar: "hebrew" as const,
      };

      const formatter = new Intl.DateTimeFormat("he-IL", options);
      const [day, b, month] = formatter.formatToParts(currentDate); // Extract month and day
      console.log("dayday", day, month, b);
      console.log("month", month);
      console.log("b", b);
      const hebrewDay = String(getHebrewDay(Number(parseInt(day.value, 10)))); // Convert numeric day to Hebrew letters
      const formattedHebrewDate = `${hebrewDay}' ${month.value}`;
      setHebrewDate(formattedHebrewDate);
    };

    updateHebrewDate();
    const intervalId2 = setInterval(updateHebrewDate, 24 * 60 * 60 * 1000);
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    const intervalStep = setInterval(() => {
      setStep((prevStep) => (prevStep === 2 ? 0 : prevStep + 1));
    }, timeBetweenScreens);

    // Clear the interval when the component unmounts
    fetchData();
    return () => {
      clearInterval(intervalId2);
      clearInterval(intervalId);
      clearInterval(intervalStep);
    };
  }, [id]);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  // Ensure minutes are displayed with leading zero if less than 10
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

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
          className=" !bg-cover flex h-screen flex-col items-center justify-center p-3 w-full rounded-sm"
        >
          <div className="flex flex-col gap-4 h-full w-full items-center justify-center">
            <div
              className="sm:text-8xl py-4 font-bold font-['Yiddish'] "
              style={{
                color: dbBoard.boardTextColor === "auto" ? colors[2] : "black",
              }}
            >
              {dbBoard.boardName}
            </div>
            <div className="flex gap-6 w-[80%] min-h-3/4">
              <div className="flex flex-col justify-between gap-3 sm:min-w-96 w-full ">
                <div
                  style={{
                    color:
                      dbBoard.boardTextColor === "auto" ? colors[1] : "black",
                  }}
                  className="backdrop-opacity-10 rounded-md backdrop-invert bg-white/50 px-3 py-4 h-full w-full   flex items-center justify-center shadow-sm font-['Yiddish'] sm:text-7xl  text-amber-600-600/75"
                >
                  {hours}:{formattedMinutes}
                </div>
                <div
                  style={{
                    color:
                      dbBoard.boardTextColor === "auto" ? colors[2] : "black",
                  }}
                  className="backdrop-opacity-10 rounded-md backdrop-invert bg-white/50 px-3 py-4 h-full w-full   flex items-center justify-center shadow-sm font-['Yiddish'] sm:text-6xl text-amber-600-600/75"
                >
                  {hebrewDate}
                </div>

                <div
                  style={{
                    color:
                      dbBoard.boardTextColor === "auto" ? colors[1] : "black",
                  }}
                  className="backdrop-opacity-10 rounded-md backdrop-invert bg-white/50 px-3 py-4 h-full w-full   flex items-center justify-center shadow-sm font-['Yiddish'] sm:text-6xl text-amber-600-600/75"
                >
                  {props.parasha}
                  {/* {props.parasha
                    .split(" ")
                    .filter((word) => word !== "פרשת")
                    .join(" ")} */}
                </div>
              </div>
              <div className="backdrop-opacity-10 rounded-md backdrop-invert bg-white/50 h-full sm:min-w-96 w-full  flex flex-col p-6 ">
                <div
                  className=" py-2 font-['Yiddish'] sm:text-5xl text-amber-600-600/75"
                  style={{
                    color:
                      dbBoard.boardTextColor === "auto" ? colors[1] : "black",
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
                            className="font-['Alef'] font-light text-2xl"
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
                            className="font-['Damka'] text-3xl [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)]"
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
                        {dbBoard.tfilaTimes.filter(
                          (tfila) => !tfila.isSaturdayTfila
                        ) && (
                          <div
                            className=" py-2 font-['Alef'] sm:text-3xl text-amber-600-600/75"
                            style={{
                              color:
                                dbBoard.boardTextColor === "auto"
                                  ? colors[1]
                                  : "black",
                            }}
                          >
                            יום חול
                          </div>
                        )}
                        <div className="grid gap-2 xl:grid-cols-3 sm:grid-cols-2 ">
                          {dbBoard.tfilaTimes.map((tfila: Tfila) => {
                            return !tfila.isSaturdayTfila ? (
                              <div>
                                <div
                                  style={{
                                    color:
                                      dbBoard.boardTextColor === "auto"
                                        ? colors[2]
                                        : "black",
                                  }}
                                  className="font-['Alef'] font-light sm:text-2xl"
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
                                  className="font-['Damka'] sm:text-3xl [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)]"
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
                      <div className="flex flex-col">
                        {dbBoard.tfilaTimes.filter(
                          (tfila) => tfila.isSaturdayTfila
                        ) && (
                          <div
                            className=" py-2 font-['Alef'] sm:text-3xl text-amber-600-600/75"
                            style={{
                              color:
                                dbBoard.boardTextColor === "auto"
                                  ? colors[1]
                                  : "black",
                            }}
                          >
                            שבת
                          </div>
                        )}
                        <div className="grid gap-2 xl:grid-cols-3 sm:grid-cols-2 ">
                          {dbBoard.tfilaTimes.map((tfila: Tfila) => {
                            return tfila.isSaturdayTfila ? (
                              <div>
                                <div
                                  style={{
                                    color:
                                      dbBoard.boardTextColor === "auto"
                                        ? colors[2]
                                        : "black",
                                  }}
                                  className="font-['Alef'] font-light sm:text-2xl"
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
                                  className="font-['Damka'] sm:text-3xl [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)]"
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
                    </div>
                  )}
                  {step === 2 && (
                    <ul className="flex flex-col gap-2">
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
                              className="font-['Alef'] font-light sm:text-2xl "
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
          </div>
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
};

interface Props {
  parasha: string;
  zmanim: Zman[] | undefined;
  board?: Board;
}
