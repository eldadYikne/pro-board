import "./App.css";
import Navbar from "./components/Navbar";
import ConfirmedPlace from "./components/ConfirmedPlace";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import Map from "./components/Map";
import Seat from "./types/user";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  writeBatch,
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { db } from ".";
import { initializeApp } from "firebase/app";
import { dbUsers } from "./utils/const";
import User from "./types/user";

function App() {
  const [users, setUsers] = useState<any>();
  const [seats, setSeats] = useState<any>();
  const [newUser, setNewUser] = useState<any>();
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
    <div dir="rtl" className="">
      <BrowserRouter>
        <Navbar setNewUser={setNewUser} />
        {/* <button onClick={getUsers}>לחץ כאן להביא משתמשים</button>
        <button onClick={postDataByNumberSeats}>לחץ כאן להעלות</button>
        <button onClick={getSeats}>לחץ כאן לבדוק</button> */}

        <Routes>
          <Route path="/" element={<ConfirmedPlace user={newUser} />} />
          <Route path="map" element={<Map />} />
        </Routes>

        {/* <header className="flex bg-red-800 App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> 
       
      */}
      </BrowserRouter>
    </div>
  );
}

export default App;
