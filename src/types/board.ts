import { TranslationsZmanimKeys } from "./zmanim";

export interface Board {
  city: string;
  geoId: string;
  timeScreenPass: string;
  tfilaTimes: Tfila[];
  forUplifting: string[];
  forMedicine: string[];
  messages: Message[];
  boardBackgroundImage: BoardBackgroundImage;
  mapBackgroundImage: string;
  timesToShow: TranslationsZmanimKeys[];
  users: string[];
  theme: Theme;
}

interface Tfila {
  time: string;
  name: TfilaName;
  isSaturdayTfila: boolean;
}
interface Message {
  title: string;
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

type Theme = "regular" | "primary" | "gold";
