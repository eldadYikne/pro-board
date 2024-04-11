import { useState, useEffect } from "react";
import User from "../types/user";
import Switch from "@mui/material/Switch";
import axios from "axios";
import OutoComplete from "./OutoComplete";
function ConfirmedPlace() {
  const [parasha, setParasha] = useState("");
  const [candles, setCandles] = useState("");
  const [havdalah, setHavdalah] = useState("");
  const [user, setUser] = useState<User>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalPresent, setShowModalPresent] = useState<boolean>(false);
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
    try {
      const { data } = await axios.get("http://localhost:8080/users");
      console.log("getParasha", "data", data);

      setUsers(data);
    } catch (err) {}

    fetch(
      "https://www.hebcal.com/shabbat?cfg=json&geonameid=293619&ue=off&b=18&M=on&lg=he&lg=s&tgt=_top"
    )
      .then((response) => response.text())
      .then((data) => {
        currentData = JSON.parse(data);
        console.log("currentData from fetch", currentData.items[2].hebrew);
        console.log("currentData ", currentData);
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

  const apiCall = async () => {
    try {
      // const data = await axios.post("http://localhost:8080/user", {
      //   name: "אלדד יקנה",
      //   seats: ["1", "3", "2"],
      //   present: true,
      // });
      // const data = await axios.get("http://localhost:8080/users");
      // const data = await axios.get("http://localhost:8080");
      // console.log(data.data);
    } catch (err) {}
  };

  const onConfirmedPlace = () => {
    const user = localStorage.getItem("user");
    if (user) {
      let userToSet = JSON.parse(user);
      setUser(userToSet);
      if (showModalPresent) {
        setShowModalPresent(false);
      } else {
        setShowModalPresent(true);
      }
    } else {
      setShowModal(true);
    }
  };
  const onPickUsername = (user: User) => {
    setUser(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (!user?._id) {
      const userWithId = users?.find(
        (currUser) => user?.name === currUser.name
      );
      if (userWithId) {
        setUser(userWithId);
      }
    }
    try {
      const data = await axios.put(`http://localhost:8080/user/${user?._id}`, {
        name: user?.name,
        present: checked,
      });
    } catch (err) {
      console.log(err);
    }
    console.log(event.target.checked);
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
