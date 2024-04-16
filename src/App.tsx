import "./App.css";
import Navbar from "./components/Navbar";
import ConfirmedPlace from "./components/ConfirmedPlace";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Map from "./components/Map";
import Seat from "./types/user";
import {
  addDoc,
  collection,
  getDocs,
  writeBatch,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from ".";
import User from "./types/user";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PayBox from "./assets/paybox.png";
function App() {
  const [users, setUsers] = useState<any>();
  const [seats, setSeats] = useState<any>();
  const [newUser, setNewUser] = useState<any>();
  const [value, setValue] = useState(0);
  const [parasha, setParasha] = useState("");
  const [candles, setCandles] = useState("");
  const [havdalah, setHavdalah] = useState("");

  useEffect(() => {
    async function fetchData() {
      await getParasha();
    }
    fetchData();
  }, []);
  const getParasha = async () => {
    console.log("getParasha");
    let currentData;

    fetch(
      "https://www.hebcal.com/shabbat?cfg=json&geonameid=293619&ue=off&b=18&M=on&lg=he&lg=s&tgt=_top"
    )
      .then((response) => response.text())
      .then((data) => {
        currentData = JSON.parse(data);
        // console.log("currentData from fetch", currentData.items[2].hebrew);
        // console.log("currentData ", currentData);
        const currentParasha = currentData.items.find(
          (item: any) => item.category === "parashat"
        );
        const currentCandles = currentData.items.find(
          (item: any) => item.category === "candles"
        );
        const currentHavdalah = currentData.items.find(
          (item: any) => item.category === "havdalah"
        );

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
  const getSeats = async () => {
    await getDocs(collection(db, "seats"))
      .then((shot) => {
        const news = shot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setSeats(news);
        console.log("SEATS", news);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div dir="rtl" className="site-container">
      <div className="content-wrap">
        <BrowserRouter>
          <Navbar setNewUser={setNewUser} />
          {/* <button onClick={getUsers}>לחץ כאן להביא משתמשים</button>
        <button onClick={postDataByNumberSeats}>לחץ כאן להעלות</button>
        <button onClick={getSeats}>לחץ כאן לבדוק</button> */}

          <Routes>
            <Route
              path="/"
              element={
                <ConfirmedPlace
                  havdalah={havdalah}
                  candles={candles}
                  parasha={parasha}
                  user={newUser}
                />
              }
            />
            <Route path="map" element={<Map parasha={parasha} />} />
          </Routes>

          {/* <header className="flex bg-red-800 App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> 
       
      */}
        </BrowserRouter>
      </div>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="פייבוקס" icon={<CreditScoreIcon />} />
        <BottomNavigationAction label="ווצאפ קהילתי" icon={<WhatsAppIcon />} />
      </BottomNavigation>
    </div>
  );
}

export default App;
