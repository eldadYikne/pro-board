import { Zman } from "../types/zmanim";
import BoardBackground1 from "../assets/board-background1.jpg";
import { useEffect, useState } from "react";
function Board(props: Props) {
  const [idxZmanim, setIdxXmanim] = useState([
    1, 2, 4, 5, 7, 8, 10, 11, 12, 15, 16, 17, 19,
  ]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setNewStep();
    return setNewStep(true);
  }, []);

  const setNewStep = (stopInterval: boolean = false) => {
    const stepInterval = setInterval(() => {
      if (step === 1) {
        console.log("step", step);
        setStep(0);
      } else {
        console.log("step up", step);

        setStep(step + 1);
      }
    }, 10000);
    if (stopInterval) {
      console.log("kill interval");
      clearInterval(stepInterval);
    }
  };
  const dataNight = [
    {
      time: "18:20",
      value: "שיר השירים",
    },
    { value: "מנחה(למנצח)", time: "18:35" },
  ];
  const dataSaturday = [
    { time: "08:30", value: "תפילת שחרית(הודו)" },
    { time: "", value: "שיעור עם הרב עדיאל אברהם", isBold: true },
    { time: "17:00", value: "שיעור עם הרב עובדיה" },
    { time: "17:45", value: "תפילת מנחה" },
    { time: "19:35", value: "ערבית של צאת שבת" },
  ];
  return (
    <div
      style={{ background: `url(${BoardBackground1})` }}
      className=" flex h-screen flex-col items-center justify-between p-3 w-full rounded-sm"
    >
      {props.zmanim && step === 0 && (
        <div className="flex flex-col gap-7 p-5">
          <span className="text-5xl font-bold w-full h-full text-center flex items-center justify-center">
            זמנים
          </span>
          <div className="grid sm:grid-cols-2 justify-between w-full items-center gap-10">
            {props.zmanim.map((zman, idx) => {
              return idxZmanim.includes(idx) ? (
                <div className="flex gap-2 shadow-lg text-4xl font-bold min-w-72 justify-between">
                  <span>{zman.name} :</span>
                  <span>{zman.time}</span>
                </div>
              ) : (
                <span className="hidden"></span>
              );
            })}
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="flex flex-col">
          <div className="flex grid grid-cols-2">
            <div>
              <span className="flex text-4xl underline mb-4"> ערב שבת </span>
              {dataNight.map((data) => {
                return (
                  <div className="flex gap-1 text-3xl font-bold">
                    {data.time && <span>{data.time} -</span>}
                    <span>{data.value}</span>
                  </div>
                );
              })}
            </div>
            <div>
              <span className="flex text-4xl underline mb-4"> יום שבת </span>
              {dataSaturday.map((data) => {
                return (
                  <div className="flex gap-1 text-3xl font-bold">
                    <span>{data.time} -</span>
                    <span>{data.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Board;

Board.defaultProps = {
  parasha: "",
  zmanim: null,
};

interface Props {
  parasha: string;
  zmanim: Zman[] | null;
}
