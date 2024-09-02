import { Board } from "./board";
import { KdropDownOption } from "./dropDown";

export interface FieldToNewBoard {
  key: keyof Board;
  options?: KdropDownOption[];
  text:
    | "שם"
    | "id"
    | "מיקום"
    | "בעלי הרשאות"
    | "קישור לעמוד פייבוקס"
    | "סוג לוח";
}
