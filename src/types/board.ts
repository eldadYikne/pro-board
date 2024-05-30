import User from "./user";
import { TranslationsZmanimKeys } from "./zmanim";

export interface Board {
  id?: string;
  boardName: string;
  geoId: string;
  timeScreenPass: string;
  dateTypes: string[];
  tfilaTimes: Tfila[];
  forUplifting: Message[];
  forMedicine: Message[];
  messages: Message[];
  boardBackgroundImage: string;
  boardTextColor: string;
  mapBackgroundImage: string;
  timesToShow: Array<keyof TranslationsZmanimKeys>;
  users?: User[];
  theme: Theme;
  isMinchaSunset: { isActive: boolean; minBrforeSunSet: number };
  screens: ScreenType[];
  backgroundToWhatsappImg: string;
  // password: string;
}

export interface Tfila {
  time: string;
  name: string;
  day: ShabatDayTfila;
}
export interface ScreenType {
  id: string;
  type: ScreenTypeTypes;
  text: "תמונה" | "הודעה לציבור" | "איחולים" | "";
  title: string;
  content: string;
  background?: string;
}
export type ScreenTypeTypes = "image" | "message" | "birthday";
export type ShabatDayTfila = "saturday" | "friday" | "weekday";
export interface ShabatTimesToEdit {
  type: ShabatDayTfila;
  name: string;
}
export interface Message {
  content: string;
  date: Date;
}
interface BoardBackgroundImage {
  times: string;
  tfilaTimes: string;
  messages: string;
}

type TfilaName =
  | "מנחה"
  | "שחרית"
  | "ערבית"
  | "שחרית(הודו)"
  | "מנחה(אשרי)"
  | "מנחה ערב שבת"
  | "ערבית של שבת"
  | "שחרית של שבת"
  | "מנחה של שבת"
  | "(אשרי) מנחה של שבת"
  | "ערבית צאת שבת";

export type Theme = "modern" | "column" | "gold";
export interface TimeObj {
  seconds: number;
  nanoseconds: number;
}
