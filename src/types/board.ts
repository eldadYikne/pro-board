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
  users?: string[];
  theme: Theme;
  isMinchaSunset: boolean;
}

export interface Tfila {
  time: string;
  name: string;
  isSaturdayTfila: boolean;
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
