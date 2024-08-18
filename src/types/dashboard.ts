import { Board } from "./board";

export interface FieldToNewBoard {
  key: keyof Board;
  text: "שם" | "id" | "מיקום" | "בעלי הרשאות" | "קישור לעמוד פייבוקס";
}
