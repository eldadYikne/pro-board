import "./App.css";
import Navbar from "./components/Navbar";
import ConfirmedPlace from "./components/ConfirmedPlace";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useParams,
  useRoutes,
} from "react-router-dom";
import Map from "./components/Map";
import Seat from "./types/user";
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
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  getCurrentDate,
  getHoursAndMinutes,
  translationsZmanimKeys,
} from "./utils/const";
import { TranslationsZmanimKeys, Zman } from "./types/zmanim";
import EditBoard from "./components/EditBoard";
import Kboard from "./components/Kboard";
function App() {
  const [users, setUsers] = useState<any>();
  const [board, setBoard] = useState<any>();
  const [newUser, setNewUser] = useState<any>();
  const [value, setValue] = useState(0);
  const [parasha, setParasha] = useState("");
  const [candles, setCandles] = useState("");
  const [havdalah, setHavdalah] = useState("");
  const [zmanim, setZmanim] = useState<Zman[]>();
  const location = useLocation();
  const { hash, pathname, search } = location;
  console.log("location.pathname ", pathname);
  useEffect(() => {
    async function fetchData() {
      await getParasha();
    }
    fetchData();
  }, []);
  const getParasha = async () => {
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
        setZmanim(zmanimData);
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
        const currentHavdalahDate = `${new Date(
          currentHavdalah.date
        ).getHours()}:${new Date(currentHavdalah.date).getMinutes()}`;

        const currentCandlesDate = `${new Date(
          currentCandles.date
        ).getHours()}:${new Date(currentCandles.date).getMinutes()}`;

        setHavdalah(currentHavdalahDate);
        setCandles(currentCandlesDate);
        setParasha(currentParasha.hebrew);
      })

      .catch((err) => console.log(err));
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
  };
  const postDataByNumberSeats = async () => {
    let array: Seat[] = [];
    users?.forEach((user: User) => {
      user.seats?.forEach((seat: string) =>
        array.push({
          name: user.name,
          seat,
          present: user.present,
        })
      );
    });

    await postCollection("seats", array);
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

  const getBoards = async () => {
    await getDocs(collection(db, "boards"))
      .then((shot) => {
        const news = shot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        // setBoard(news);
        console.log("boards", news);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div dir="rtl" className="site-container">
      <div className="content-wrap">
        {!pathname.includes("board") && <Navbar setNewUser={setNewUser} />}

        <Routes>
          <Route
            path="/confirm/:id"
            element={
              <ConfirmedPlace
                havdalah={havdalah}
                candles={candles}
                parasha={parasha}
                user={newUser}
                zmanim={zmanim}
              />
            }
          />
          <Route path="/" element={<div>עמוד לא נמצא</div>} />
          <Route path="/map" element={<Map parasha={parasha} />} />
          <Route
            path="/edit/:id"
            element={<EditBoard zmanim={zmanim} parasha={parasha} />}
          />
          <Route
            path="/board/:id"
            element={<Kboard zmanim={zmanim} parasha={parasha} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
