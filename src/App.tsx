import "./App.css";
import Navbar from "./components/Navbar";
import ConfirmedPlace from "./components/ConfirmedPlace";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import Map from "./components/Map";
import ReactDOM from "react-dom/client";
import {
  addDoc,
  collection,
  getDocs,
  writeBatch,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from ".";
import User from "./types/user";

import {
  getCurrentDate,
  getHoursAndMinutes,
  omerArrayDays,
  translationsZmanimKeys,
} from "./utils/const";
import { TimesDataScheme, TranslationsZmanimKeys, Zman } from "./types/zmanim";
import EditBoard from "./components/EditBoard";
import Kboard from "./components/Kboard";
import EditUsers from "./components/EditUsers";
import { isTimeBetween0000And0130, isWithinPast24Hours } from "./utils/utils";
function App() {
  const [users, setUsers] = useState<any>();
  const [board, setBoard] = useState<any>();
  const [newUser, setNewUser] = useState<any>();
  const [hebrewDate, setHebrewDate] = useState<string>();
  const [parasha, setParasha] = useState("");
  const [candles, setCandles] = useState("");
  const [havdalah, setHavdalah] = useState("");
  const [dayTimes, setDayTimes] = useState<Zman[]>();
  const [isMoridHatal, setIsMoridHatal] = useState<boolean>();
  const [lastTimeUpdatedTimesData, setLastTimeDataUpdated] = useState<string>();
  const location = useLocation();
  const [omerDays, setOmerDays] = useState<string>("");
  const { hash, pathname, search } = location;

  console.log("location.pathname ", pathname);
  const { id } = useParams();
  useEffect(() => {
    async function fetchData() {
      await getTimesFromDb();
    }
    fetchData();
    const hourlyInterval = setInterval(async () => {
      let timeBetween0000And0130 = isTimeBetween0000And0130();
      const isPast24Hours = isWithinPast24Hours(
        String(lastTimeUpdatedTimesData)
      );

      if (timeBetween0000And0130) {
        await getTimesFromApi();
        console.log("fetchDataFromAPI!");
      } else if (isPast24Hours) {
        await getTimesFromApi();
        console.log("fetchDataFromAPI!");
      }
    }, 3600000);
    return () => {
      clearInterval(hourlyInterval);
    };
  }, []);
  const getTimesFromApi = async () => {
    console.log("getParasha");
    let shabatData;
    let zmanimData: Zman[] = [];
    let currentDate = getCurrentDate();

    fetch(
      `https://www.hebcal.com/zmanim?cfg=json&geonameid=293619&date=${currentDate}`
    )
      .then((res) => res.text())
      .then((data) => {
        let newData = JSON.parse(data);
        console.log("zmanimData ", newData);

        for (const property in newData.times) {
          zmanimData.push({
            name: String(
              translationsZmanimKeys[property as keyof TranslationsZmanimKeys]
            ),
            time: getHoursAndMinutes(newData.times[property]),
          });
        }
        console.log("zmanimDatazmanimData ", zmanimData);

        setDayTimes(zmanimData);
        // postCollection("zmanim", zmanimData);
        updateCollectionById("times", { dayTimes: zmanimData }, "times");
      });
    fetch(
      `https://www.hebcal.com/converter?cfg=json&gy=now&gm=now&gd=now&g2h=1&date=${currentDate}`
    )
      .then((res) => res.text())
      .then((data) => {
        let newData = JSON.parse(data);
        console.log("moridHatalData ", newData);
        const hebrewMonth = newData.hm; //
        let isRainySeason = [
          "Cheshvan",
          "Kislev",
          "Tevet",
          "Shevat",
          "Adar",
          "Nisan",
        ].includes(hebrewMonth);
        if (newData.hm === "Nisan" && newData.hd > 14) {
          isRainySeason = false;
        } else if (newData.hm === "Cheshvan" && newData.hd > 7) {
          isRainySeason = true;
        }
        let omerCurrentDay;
        if (newData.events) {
          const omer = newData.events.find((ev: string) => ev.includes("Omer"));
          if (omer) {
            let omerNumber = omer
              .split(" ")
              .find((word: string) => word.includes("th"));
            omerCurrentDay = omerArrayDays.find(
              (day) => day.number === omerNumber
            );
            if (omerCurrentDay?.he) {
              setOmerDays(omerCurrentDay?.he ?? "");
            }
          }
        }
        let currentHebrewDate = `${newData.heDateParts.d} ${newData.heDateParts.m} ${newData.heDateParts.y}`;
        if (currentHebrewDate) {
          setHebrewDate(currentHebrewDate);
        }
        setIsMoridHatal(!isRainySeason);

        postCollectionCoustumId(
          "times",
          {
            isMoridHatal: !isRainySeason,
            hebrewDate: currentHebrewDate,
            sfiratOmer: omerCurrentDay?.he ?? "",
          },
          "times"
        );
        updateCollectionById(
          "times",
          { lastTimeDataUpdated: new Date() },
          "times"
        );
      });

    fetch(
      "https://www.hebcal.com/shabbat?cfg=json&geonameid=293619&ue=off&b=18&M=on&lg=he&lg=s&tgt=_top"
    )
      .then((response) => response.text())
      .then((data) => {
        shabatData = JSON.parse(data);
        // console.log("currentData from fetch", currentData.items[2].hebrew);
        console.log("shabatData ", shabatData);
        let currentParasha = shabatData.items.find(
          (item: any) => item.category === "parashat"
        );
        const currentCandles = shabatData.items.find(
          (item: any) => item.category === "candles"
        );
        const currentHavdalah = shabatData.items.find(
          (item: any) => item.category === "havdalah"
        );
        if (!currentParasha) {
          currentParasha = shabatData.items.find(
            (item: any) =>
              item.category === "holiday" &&
              item.subcat === "major" &&
              item.date === currentDate
          );
        }
        let minutesHavdala = new Date(currentCandles.date).getMinutes();
        let formattedHavdalasMin =
          minutesHavdala < 10 ? `0${minutesHavdala}` : `${minutesHavdala}`;
        const currentHavdalahDate = `${new Date(
          currentHavdalah.date
        ).getHours()}:${formattedHavdalasMin}`;

        let minutesCandles = new Date(currentCandles.date).getMinutes();
        let formattedCandlesMin =
          minutesCandles < 10 ? `0${minutesCandles}` : `${minutesCandles}`;
        const currentCandlesDate = `${new Date(
          currentCandles.date
        ).getHours()}:${formattedCandlesMin}`;

        setHavdalah(currentHavdalahDate);
        setCandles(currentCandlesDate);
        setParasha(currentParasha.hebrew);

        updateCollectionById(
          "times",
          {
            sahabatTimes: {
              havdala: currentHavdalahDate,
              parasha: currentParasha.hebrew,
              candles: currentCandlesDate,
            },
          },
          "times"
        );
      })

      .catch((err) => console.log(err));
  };
  const getTimesFromDb = async () => {
    const timesCollection: TimesDataScheme =
      (await getTimes()) as TimesDataScheme;
    console.log("timesCollection", timesCollection);
    const {
      dayTimes,
      hebrewDate,
      isMoridHatal,
      lastTimeDataUpdated,
      sahabatTimes,
      id,
      sfiratOmer,
    } = timesCollection;
    setLastTimeDataUpdated(String(lastTimeDataUpdated));
    const isPast24Hours = isWithinPast24Hours(String(lastTimeDataUpdated));

    if (timesCollection && !isPast24Hours) {
      setHavdalah(sahabatTimes.havdala);
      setCandles(sahabatTimes.candles);
      setParasha(sahabatTimes.parasha);
      setHebrewDate(hebrewDate);
      setOmerDays(sfiratOmer ?? "");
      setDayTimes(dayTimes);
      setIsMoridHatal(isMoridHatal);
      console.log("fetchDataFromDb!", timesCollection);
    } else if (isPast24Hours) {
      await getTimesFromApi();
      console.log("fetchDataFromAPI!", timesCollection);
    }
  };
  const getZmanimAndParasha = async () => {
    await getDocs(collection(db, "zmanim"))
      .then((shot) => {
        const news = shot.docs.map((doc) => ({ ...doc.data() }));
        if (news) {
          setDayTimes(news as Zman[]);
        }
        console.log("zmanim from db", news);
      })
      .catch((error) => console.log(error));
  };
  const postCollection = async (
    collectionName: string,
    collectionValues: any[]
  ) => {
    const batch = writeBatch(db);
    const usersCollectionRef = collection(db, collectionName);

    // Iterate through the array of user objects
    collectionValues.forEach((value) => {
      // Create a new document reference for each user
      const newDocRef = doc(usersCollectionRef);

      // Set the data for the document
      batch.set(newDocRef, value);
    });

    // Commit the batch write
    await batch.commit();
    console.log(collectionName, "new collection is upload!");
  };
  const postCollectionCoustumId = async (
    collectionName: string,
    collectionValues: any,
    idNameCollection: string
  ) => {
    const batch = writeBatch(db);
    const boardRef = doc(collection(db, collectionName), idNameCollection); // Using 'calaniot' as the board ID

    // Set the data for the board document
    batch.set(boardRef, collectionValues);

    // Commit the batch write
    await batch.commit();
  };
  const postCollectionCoustumIdWithArrayObjects = async (
    collectionName: string,
    collectionValues: any[],
    idNameCollection: string
  ) => {
    const batch = writeBatch(db);
    const boardRef = doc(collection(db, collectionName), idNameCollection); // Using 'calaniot' as the board ID

    // Set the data for the board document
    batch.set(boardRef, { [idNameCollection]: collectionValues });

    // Commit the batch write
    await batch.commit();
  };
  const postDataByNumberSeats = async () => {
    let array: any[] = [];
    users?.forEach((user: User) => {
      array.push({
        name: user.name,
        present: user.present,
      });
    });

    // await postCollection("seats", array);
    console.log("array", users);
  };
  const updateUser = async (userId: string, userData: any) => {
    const userRef = doc(collection(db, "users"), userId); // Get reference to the user document

    try {
      await updateDoc(userRef, userData); // Update the user document with new data
      console.log("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const updateCollectionById = async (
    cellectionName: string,
    userData: any,
    userId: string
  ) => {
    const userRef = doc(collection(db, cellectionName), userId); // Get reference to the user document

    try {
      await updateDoc(userRef, userData); // Update the user document with new data
      console.log("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const updateBoard = async (boardId: string, boardData: any) => {
    const boardRef = doc(collection(db, "boards"), boardId); // Get reference to the user document
    try {
      await updateDoc(boardRef, boardData); // Update the user document with new data
      console.log("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const postUser = async () => {
    const docRef = await addDoc(collection(db, "users"), {
      user: { name: "יעקב כהן", seats: ["1"], present: false },
    });
    console.log("doc !!!", docRef);
  };
  const getUsers = async () => {
    await getDocs(collection(db, "users"))
      .then((shot) => {
        const news = shot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setUsers(news);
        console.log("news", news);
      })
      .catch((error) => console.log(error));
  };
  const getBoardById = async (boardId: string) => {
    try {
      const boardDoc = await getDoc(doc(db, "boards", boardId));
      if (boardDoc.exists()) {
        // Document exists, return its data along with the ID
        const dbBoard = { ...boardDoc.data(), id: boardDoc.id };
        setBoard(dbBoard);
        console.log(dbBoard);
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
  const getTimes = async () => {
    try {
      const boardDoc = await getDoc(doc(db, "times", "times"));
      if (boardDoc.exists()) {
        // Document exists, return its data along with the ID
        const dbBoard = { ...boardDoc.data(), id: boardDoc.id };
        console.log(dbBoard);
        return dbBoard;
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

  const getCollectionByName = async (collectionName: string) => {
    await getDocs(collection(db, collectionName))
      .then((shot) => {
        const news = shot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log(collectionName, news);
        return news;
      })
      .catch((error) => console.log(error));
  };

  return (
    <div dir="rtl" className="site-container">
      <div className="content-wrap">
        {!pathname.includes("board") && <Navbar setNewUser={setNewUser} />}
        {/* <button onClick={getUsers}>לחץ כאן להביא משתמשים</button> */}
        {/* <button onClick={() => postCollectionCoustumId("boards", [dbBoard],'calaniot')}>
          לחץ כאן להעלות
        </button> 
          
          <button
            onClick={() =>
              postCollectionCoustumId("boards", dbBoard, "calaniot")
            }
          >
            לחץ כאן להעלות
          </button>
     
        */}
        <Routes>
          <Route path="/" element={<div>עמוד לא נמצא</div>} />
          <Route path="/map" element={<Map parasha={parasha} />} />
          <Route
            path="/confirm/:id"
            element={
              <ConfirmedPlace
                havdalah={havdalah}
                candles={candles}
                parasha={parasha}
                user={newUser}
                zmanim={dayTimes}
              />
            }
          />
          <Route
            path="/edit/:id"
            element={<EditBoard zmanim={dayTimes} parasha={parasha} />}
          />
          <Route path="/users/:id" element={<EditUsers />} />
          <Route
            path="/board/:id"
            element={
              <Kboard
                isMoridHatal={isMoridHatal}
                zmanim={dayTimes}
                parasha={parasha}
                omerDays={omerDays}
              />
            }
          />
          {/* <Route path="*" element={<div>404 עמוד לא נמצא</div>} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
