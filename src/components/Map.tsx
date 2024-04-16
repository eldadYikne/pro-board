import React, { useEffect, useRef, useState } from "react";
import User from "../types/user";
import chair from "../assets/chair.svg";
import man from "../assets/man.svg";
import { collection } from "firebase/firestore";
import { db } from "..";
import { onSnapshot } from "firebase/firestore";
import { Button } from "@mui/material";
import { toPng } from "html-to-image";
function Map(props: Props) {
  const seat = [8, 18];
  const allSeats: any = [];
  const [seats, setSeats] = useState<any>();
  const elementRef = useRef(null);
  useEffect(() => {
    async function fetchData() {
      // await getUsers();
    }
    fetchData();
  }, [seats]);

  const getUsers = async () => {
    let updatedUsers: User[] = [];
    const unsub = await onSnapshot(collection(db, "users"), (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let updatedUser: any = { id: String(doc.id), ...doc.data() };
        if (doc.data().name === "הלוי") {
          console.log("Document ID: ", doc.id);
          console.log("Document data: ", doc.data());
        }
        updatedUsers.push(updatedUser);
      });
      getSeats(JSON.parse(JSON.stringify(updatedUsers)));
      updatedUsers = [];
    });

    // await getDocs(collection(db, "users"))
    //   .then((shot) => {
    //     const news = shot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    //     // setUsers(news);
    //     console.log("news", news);
    //     getSeats(news as User[]);
    //   })
    //   .catch((error) => console.log(error));
  };

  const getSeats = (users: User[]) => {
    try {
      console.log("users", users);
      for (var i = 0; i < seat[0]; i++) {
        allSeats[i] = [];
        for (var j = 0; j < seat[1]; j++) {
          if (j > 6 && j < 11 && i > 2) {
            allSeats[i][j] = "";
          } else {
            let currentSeat = `${i}${j}`;
            allSeats[i][j] =
              users.find((user: User) =>
                user.seats?.find((seat: string) => seat === currentSeat)
              ) ?? currentSeat;
          }
        }
      }
      setSeats(JSON.parse(JSON.stringify(allSeats)));
      console.table(allSeats);
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
          link.download = ` ${props.parasha} - סידורי ישיבה.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div
      dir="ltr"
      className="bg-[#f2d4b0]  flex flex-col items-center overflow-x-auto justify-center text-black"
    >
      {seats?.length > 1 && (
        <div className="bg-white m-2 ">
          <Button onClick={htmlToImageConvert} color="primary">
            הורדת תמונה{" "}
          </Button>
        </div>
      )}
      {!seats && (
        <div className="bg-white m-2 ">
          <Button onClick={getUsers} color="primary">
            הצג מפה
          </Button>
        </div>
      )}
      <div className="flex flex-col items-center" ref={elementRef}>
        <table>
          <tbody>
            {seats?.length > 1 &&
              seats?.map((row: any, rowIndex: number) => (
                <tr className="py-2 flex" key={rowIndex}>
                  {row.map((seatData: any, columnIndex: number) => {
                    let currentSeatNumber = `${rowIndex}${columnIndex}`;
                    return seatData.name ? (
                      <td
                        className="px-2 w-14 h-14 flex flex-col items-center justify-center relative td-table-seat"
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
                          {/* {typeof seatData === "object"
                          ? seatData.name
                          : seatData} */}
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
        {seats?.length > 1 && (
          <div className=" border-2 flex justify-center items-center p-2 mb-2  border-black h-32 w-3/4 left-[-18px] text-black ">
            ארון
          </div>
        )}
      </div>
    </div>
  );
}

export default Map;

Map.defaultProps = {
  parasha: "",
};

interface Props {
  parasha: string;
}
