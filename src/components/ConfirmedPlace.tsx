import { useState, useEffect } from "react";
import User from "../types/user";
import Switch from "@mui/material/Switch";
import "firebase/compat/firestore";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "..";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Img1 from "../assets/img1.jpg";
function ConfirmedPlace(props: Props) {
  const [parasha, setParasha] = useState("");
  const [candles, setCandles] = useState("");
  const [havdalah, setHavdalah] = useState("");
  const [user, setUser] = useState<User>();
  const [checked, setChecked] = useState(!!props.user.present);
  const [users, setUsers] = useState<User[]>();

  const label = {
    inputProps: { "aria-label": "Switch demo" },
    label: checked ? "נמצא" : "לא נמצא",
  };
  useEffect(() => {
    async function fetchData() {
      await getParasha();
      // const existUser = JSON.parse(localStorage.getItem("user") ?? "");
      // if (existUser.name) {
      //   setUser(existUser);
      // }
    }
    fetchData();

    console.log("props.user.name", props.user);
    if (props.user.name) {
      // let userToSet = JSON.parse(user);
      setUser(props.user);
      setChecked(props.user.present);
    }
  }, [props.user]);
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
    const newUserToUse: any = props.user;
    console.log("newUserToUse", newUserToUse);
    if (!user?.id) {
      const userWithId = users?.find(
        (currUser) => user?.name === currUser.name
      );
      if (userWithId) {
        setUser(userWithId);
      }
    }
    try {
      let newUser: any = {
        id: newUserToUse?.id,
        seats: newUserToUse?.seats,
        name: newUserToUse?.name ?? "",
        present: !checked,
      };
      if (newUser?.name) {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        await updateUser(newUser?.id!, {
          name: newUser?.name,
          present: !checked,
        });
      }
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
    <div className="flex justify-center items-center w-full p-2">
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={Img1}
          alt="green iguana"
        />

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <span>נוכחות לשבת -{parasha}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <div className="text-sm w-36">
              <div className="flex justify-between">
                הדלקת נרות : <span>{candles}</span>
              </div>
              <div className="flex justify-between">
                הבדלה : <span>{havdalah}</span>
              </div>
            </div>
          </Typography>
          {props.user && (
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
        </CardContent>
      </Card>
    </div>
  );
}

export default ConfirmedPlace;
ConfirmedPlace.defaultProps = {
  user: {},
};

interface Props {
  user: User;
}
