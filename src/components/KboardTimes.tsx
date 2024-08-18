import { useContext, useEffect, useState } from "react";
import { Board } from "../types/board";
import { Zman } from "../types/zmanim";
import { getCurrentDateDayFirst } from "../utils/const";
import { BackgroundIsBlurContext } from "./Kboard";

function KboardTimes(props: Props) {
  useEffect(() => {}, [
    props.colors,
    props.board,
    props.colors,
    props.boardTextColor,
  ]);
  const isBgBlur = useContext(BackgroundIsBlurContext);
  return (
    <div className="flex flex-col justify-between gap-3 h-full  w-full ">
      <div
        style={{
          color: props.boardTextColor === "auto" ? props.colors[1] : "black",
          filter: isBgBlur ? "" : "blur(5px)",
        }}
        className="backdrop-opacity-10 text-center rounded-md backdrop-invert bg-white/50 px-3 py-4 h-full w-full   flex items-center justify-center shadow-sm font-['Yiddish'] sm:text-7xl  text-amber-600-600/75"
      >
        {props.hours}:{props.formattedMinutes}
      </div>
      <div
        style={{
          color: props.boardTextColor === "auto" ? props.colors[2] : "black",
        }}
        className="backdrop-opacity-10 text-center rounded-md backdrop-invert bg-white/50 px-3 py-4 h-full w-full   flex items-center justify-center shadow-sm font-['Yiddish'] sm:text-6xl text-amber-600-600/75"
      >
        <div className=" w-full justify-center items-center flex flex-col gap-8">
          {props.dateTypes.includes("hebrew") && (
            <span>{props.hebrewDate}</span>
          )}
          {props.dateTypes.includes("number") && (
            <span>{getCurrentDateDayFirst()}</span>
          )}
        </div>
      </div>

      <div
        style={{
          color: props.boardTextColor === "auto" ? props.colors[1] : "black",
        }}
        className="backdrop-opacity-10 text-center rounded-md backdrop-invert bg-white/50 px-3 py-4 h-full w-full   flex items-center justify-center shadow-sm font-['Yiddish'] sm:text-6xl text-amber-600-600/75"
      >
        {props.holiday ? props.holiday : props.parasha}
      </div>
      <div
        style={{
          color: props.boardTextColor === "auto" ? props.colors[1] : "black",
        }}
        className="backdrop-opacity-10 text-center rounded-md backdrop-invert bg-white/50 px-3 py-4 h-full w-full   flex items-center justify-center shadow-sm font-['Yiddish'] sm:text-6xl text-amber-600-600/75"
      >
        {props.roshChodesh
          ? props.roshChodesh
          : props.isMoridHatal
          ? "מוריד הטל"
          : "משיב הרוח ומוריד הגשם"}
      </div>
      {props.omerDays && (
        <div
          style={{
            color: props.boardTextColor === "auto" ? props.colors[1] : "black",
          }}
          className="backdrop-opacity-10  rounded-md backdrop-invert bg-white/50 px-3 py-4 h-full w-full   flex items-center justify-center text-center shadow-sm font-['Yiddish'] sm:text-6xl text-amber-600-600/75"
        >
          {props.omerDays} לעומר
        </div>
      )}
    </div>
  );
}
export default KboardTimes;

KboardTimes.defaultProps = {
  parasha: "",
  zmanim: undefined,
  isMoridHatal: false,
  colors: ["#00000", "#00000", "#00000", "#00000"],
  hebrewDate: "",
  omerDays: "",
  roshChodesh: "",
  holiday: "",
  boardTextColor: "",
  dateTypes: [],
};

interface Props {
  parasha: string;
  zmanim: Zman[] | undefined;
  board: Board;
  isMoridHatal: boolean;
  colors: string[];
  hebrewDate: string;
  omerDays: string;
  roshChodesh: string;
  formattedMinutes: string;
  holiday: string;
  hours: number;
  boardTextColor: string;
  dateTypes: string[];
}
