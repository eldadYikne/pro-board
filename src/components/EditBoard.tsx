import { useState } from "react";
import { Board } from "../types/board";
import { Input } from "@mui/base/Input";
function EditBoard(props: Props) {
  const [board, setBoard] = useState<Board>();

  // DATA
  const inputsBoard: { name: keyof Board; placeholder: string }[] = [
    { name: "city", placeholder: "עיר" },
    { name: "geoId", placeholder: "איזור לעדכון זמן" },
    { name: "timeScreenPass", placeholder: "זמן מעבר בין מסכים" },
    { name: "tfilaTimes", placeholder: "זמני תפילה" },
    { name: "forUplifting", placeholder: "לעילוי נשמת" },
    { name: "forMedicine", placeholder: "לרפואה" },
    { name: "messages", placeholder: "הודעות לציבור " },
    { name: "boardBackgroundImage", placeholder: "תמונת רקע ללוח" },
    { name: "mapBackgroundImage", placeholder: "תמונת רקע למפה" },
    { name: "timesToShow", placeholder: "זמנים להצגה" },
    { name: "users", placeholder: "משתמשים" },
    { name: "theme", placeholder: "ערכת נושא" },
  ];

  return (
    <div className="bg-orange-200 grid grid-cols-2">
      {inputsBoard.map(({ name, placeholder }) => {
        return (
          <div className="flex flex-col gap-1 p-2">
            <span>{placeholder}:</span>
            {/* <Input aria-label="Demo input" onChange={(e)=>setBoard({...board,[name as keyof Board]:e})} placeholder={""} /> */}
          </div>
        );
      })}
    </div>
  );
}
export default EditBoard;

EditBoard.defaultProps = {
  parasha: "",
};

interface Props {
  parasha: string;
}
