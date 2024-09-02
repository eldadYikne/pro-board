import KUser from "./user";
import { TranslationsZmanimKeys } from "./zmanim";

export interface Board {
  id?: string;
  type: "kodesh" | "school";
  boardSymbol?: string;
  boardName: string;
  geoId: string;
  timeScreenPass: string;
  lastTimeBoardUpdate: Date | TimeObj;
  dateTypes: string[];
  tfilaTimes?: Tfila[];
  forUplifting?: Message[];
  forMedicine?: Message[];
  messages: Message[];
  boardBackgroundImage: string;
  boardWelcomeImage?: string;
  boardTextColor: string;
  mapBackgroundImage: string;
  timesToShow?: Array<keyof TranslationsZmanimKeys>;
  users?: KUser[];
  theme: Theme;
  isSetShabatTime?: { isActive: boolean; enter: string; exit: string };
  screens: ScreenType[];
  backgroundToWhatsappImg: string;
  isFreez: boolean;
  inspirationalScreen: InspirationalScreen;
  admins: string[];
  payboxLink: string;
  messageScreenIsWhatsapp: boolean;
}

export interface Tfila {
  time: string;
  name: string;
  day: ShabatDayTfila;
}
export interface InspirationalScreen {
  isActive: boolean;
  text: string;
  writer: string;
}
export interface ScreenType {
  id: string;
  type: ScreenTypeTypes;
  text:
    | "תמונה"
    | "הודעה לציבור"
    | "איחולים"
    | "הידעת"
    | ""
    | "הודעה"
    | "קולאז׳ תמונות";
  title: string;
  imgUrl?: string | string[];
  content: string;
  background?: string;
}
export type ScreenTypeTypes =
  | "image"
  | "message"
  | "birthday"
  | "info"
  | "images";
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
export interface MenuLink {
  link: string;
  text: string;
  icon: string;
}
