import "./App.css";
import Navbar from "./components/Navbar";
import ConfirmedPlace from "./components/ConfirmedPlace";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import Map from "./components/Map";
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

function App() {
  const [users, setUsers] = useState<any>();

  const postUsers = async () => {
    const batch = writeBatch(db);
    const usersCollectionRef = collection(db, "users");

    // Iterate through the array of user objects
    dbUsers.forEach((user) => {
      // Create a new document reference for each user
      const newDocRef = doc(usersCollectionRef);

      // Set the data for the document
      batch.set(newDocRef, user);
    });

    // Commit the batch write
    await batch.commit();
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

  return (
    <div dir="rtl" className="">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ConfirmedPlace />} />
          <Route path="map" element={<Map />} />
        </Routes>

        {/* <header className="flex bg-red-800 App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
