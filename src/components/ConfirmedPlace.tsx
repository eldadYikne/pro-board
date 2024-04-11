import { useState, useEffect } from "react";
import User from "../types/user";
import Switch from "@mui/material/Switch";
import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { dbUsers } from "../utils/const";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "..";

function ConfirmedPlace() {
  const [parasha, setParasha] = useState("");
  const [candles, setCandles] = useState("");
  const [havdalah, setHavdalah] = useState("");
  const [user, setUser] = useState<User>();
  const [checked, setChecked] = useState(user?.present ?? true);
  const [users, setUsers] = useState<User[]>();

  const label = {
    inputProps: { "aria-label": "Switch demo" },
    label: checked ? "נמצא" : "לא נמצא",
  };
  useEffect(() => {
    async function fetchData() {
      await getParasha();
    }
    fetchData();
    const user = localStorage.getItem("user");

    console.log(user);
    if (user) {
      let userToSet = JSON.parse(user);
      setUser(userToSet);
    }
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

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (!user?.id) {
      const userWithId = users?.find(
        (currUser) => user?.name === currUser.name
      );
      if (userWithId) {
        setUser(userWithId);
      }
    }
    try {
      await updateUser(user?.id!, { name: user?.name, present: !checked });
    } catch (err) {
      console.log(err);
    }
    console.log(event.target.checked);
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
  return (
    <div className="flex flex-col items-center">
      <div className="bg-amber-500 h-40 p-4 flex w-4/5 my-5 rounded-2xl flex-col justify-center cursor-pointer items-center text-xl">
        <span>נוכחות לשבת -{parasha}</span>
        <div className="text-sm w-36">
          <div className="flex justify-between">
            הדלקת נרות : <span>{candles}</span>
          </div>
          <div className="flex justify-between">
            הבדלה : <span>{havdalah}</span>
          </div>
        </div>
        {user && (
          <div className="text-black  transition-all flex items-center justify-center">
            {checked ? "נמצא" : "לא נמצא"}
            <Switch
              {...label}
              defaultChecked
              checked={checked}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      {users && (
        <div className="bg-gray-300 h-24 flex flex-col items-center justify-center"></div>
      )}

      {/* {user && <div>{user.present}</div>} */}
    </div>
  );
}

export default ConfirmedPlace;
