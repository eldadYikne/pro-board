import "./App.css";
import ConfirmedPlace from "./components/ConfirmedPlace";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import Map from "./components/Map";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from ".";

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
import { checkIsPast24Hours } from "./utils/utils";
import Kdashboard from "./components/Kdashboard";
import EditKidush from "./components/EditKidush";
import { updateCollectionById } from "./service/serviceBoard";
import KHomePage from "./components/KHomePage";
function App() {
  const [hebrewDate, setHebrewDate] = useState<string>();
  const [parasha, setParasha] = useState("");
  const [candles, setCandles] = useState("");
  const [havdalah, setHavdalah] = useState("");
  const [holiday, setHoliday] = useState("");
  const [roshChodesh, setRoshChodesh] = useState("");
  const [dayTimes, setDayTimes] = useState<Zman[]>();
  const [isMoridHatal, setIsMoridHatal] = useState<boolean>();
  const [lastTimeUpdatedTimesData, setLastTimeDataUpdated] = useState<number>();
  const location = useLocation();
  const [omerDays, setOmerDays] = useState<string>("");
  const { hash, pathname, search } = location;
  const cld = new Cloudinary({ cloud: { cloudName: "dwdpgwxqv" } });
  const myImage = cld.image("docs/models");

  // Resize to 250 x 250 pixels using the 'fill' crop mode.
  myImage.resize(fill().width(250).height(250));

  console.log("location.pathname ", pathname);

  useEffect(() => {
    async function fetchData() {
      await getTimesFromDb();
    }
    fetchData();
  }, []);
  // TASK 7: CREATE ONE OBJ TO ALL TIMES

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

        updateCollectionById(
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
          { lastTimeDataUpdated: new Date().setHours(0, 30, 0, 0) },
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
        const currentRoshChodesh =
          shabatData.items.find(
            (item: any) =>
              item.category === "roshchodesh" && item.date === currentDate
          ) ?? "";
        const currentHoliday =
          shabatData.items.find(
            (item: any) =>
              item.category === "holiday" && item.date === currentDate
          ) ?? "";

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

        setHoliday(currentHoliday?.hebrew);
        setRoshChodesh(
          currentRoshChodesh?.hebrew ? currentRoshChodesh?.hebrew : ""
        );
        setHavdalah(currentHavdalahDate);
        setCandles(currentCandlesDate);
        setParasha(currentParasha.hebrew);
        updateCollectionById(
          "times",
          {
            holiday: currentHoliday?.hebrew ? currentHoliday?.hebrew : "",
            roshChodesh: currentRoshChodesh?.hebrew
              ? currentRoshChodesh?.hebrew
              : "",
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
      sfiratOmer,
      roshChodesh,
      holiday,
    } = timesCollection;
    setLastTimeDataUpdated(lastTimeDataUpdated);
    // const { seconds, nanoseconds } = lastTimeDataUpdated;
    console.log("lastTimeDataUpdated", lastTimeDataUpdated);
    // const milliseconds = seconds * 1000 + nanoseconds / 1000000;

    const date = new Date(lastTimeDataUpdated);
    console.log("date from App", date);
    const isPast24Hours = checkIsPast24Hours(String(date));
    console.log("isPast24Hours", isPast24Hours);
    // console.log("lastTimeDataUpdated", date);

    if (timesCollection && !isPast24Hours) {
      setHavdalah(sahabatTimes.havdala);
      setCandles(sahabatTimes.candles);
      setParasha(sahabatTimes.parasha);
      setHebrewDate(hebrewDate);
      setHoliday(holiday);
      setRoshChodesh(roshChodesh);
      setOmerDays(sfiratOmer ?? "");
      setDayTimes(dayTimes);
      setIsMoridHatal(isMoridHatal);
      console.log("fetchDataFromDb!", timesCollection);
    } else if (isPast24Hours) {
      await getTimesFromApi();
      console.log("fetchDataFromAPI!", timesCollection);
    }
  };

  const getTimes = async () => {
    try {
      const timesDoc = await getDoc(doc(db, "times", "times"));
      if (timesDoc.exists()) {
        // Document exists, return its data along with the ID
        const dbtimes = { ...timesDoc.data(), id: timesDoc.id };
        console.log(dbtimes);
        return dbtimes;
      } else {
        // Document does not exist
        console.log("times not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };

  return (
    <div dir="rtl" className="site-container">
      <div className="content-wrap">
        <Routes>
          <Route path="/" element={<KHomePage />} />
          <Route path="/map/:id" element={<Map parasha={parasha} />} />
          <Route
            path="/kidush/:id"
            element={<EditKidush parasha={parasha} />}
          />
          <Route
            path="/confirm/:id"
            element={
              <ConfirmedPlace
                // TASK 21: CREATE ONE OBJ TO ALL PROPS
                havdalah={havdalah}
                candles={candles}
                parasha={parasha}
                zmanim={dayTimes}
              />
            }
          />
          <Route
            path="/edit/:id"
            element={
              <EditBoard
                shabatTimes={{ candles: candles, havdalah: havdalah }}
                zmanim={dayTimes}
                parasha={parasha}
              />
            }
          />
          <Route path="/edit/:id/users" element={<EditUsers />} />
          <Route path="/dashboard" element={<Kdashboard />} />
          <Route
            path="/board/:id"
            element={
              <Kboard
                hebrewDate={hebrewDate}
                isMoridHatal={isMoridHatal}
                zmanim={dayTimes}
                parasha={parasha}
                omerDays={omerDays}
                lastTimeDataUpdated={lastTimeUpdatedTimesData}
                roshChodesh={roshChodesh}
                holiday={holiday}
                getTimesFromDb={getTimesFromDb}
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
