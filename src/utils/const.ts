import { TranslationsZmanimKeys } from "../types/zmanim";

export const dbUsers = [
  {
    name: "יקנה",
    seats: ["117"],
    present: true,
  },
  {
    name: "צברי",
    seats: ["013", "014", "015", "016", "017"],
    present: true,
  },
  {
    name: "אליה כהן",
    seats: ["114", "115", "116"],
    present: true,
  },
  {
    name: "נוריאל",
    seats: ["113", "19", "110", "112"],
    present: true,
  },
  {
    name: "טנגי",
    seats: ["18", "17"],
    present: true,
  },
  {
    name: "נפתלי",
    seats: ["13"],
    present: true,
  },
  {
    name: "גואטה",
    seats: ["10", "11", "12"],
    present: true,
  },
  {
    name: "שוקרי",
    seats: ["20", "21", "22", "23"],
    present: true,
  },
  {
    name: "פדלון",
    seats: ["26", "25"],
    present: true,
  },
  {
    name: "בנדריהם",
    seats: ["27", "28"],
    present: true,
  },
  {
    name: "חי",
    seats: ["29", "210"],
    present: true,
  },
  {
    name: "זקזאק",
    seats: ["211", "212", "213"],
    present: true,
  },
  {
    name: "מזרחי",
    seats: ["214", "215"],
    present: true,
  },
  {
    name: "פינקלשטיין",
    seats: ["216", "217"],
    present: true,
  },
  {
    name: "מנאי",
    seats: ["317", "316", "315", "314"],
    present: true,
  },
  {
    name: "לוי",
    seats: ["312", "311"],
    present: true,
  },
  {
    name: "וקנין",
    seats: ["30", "31", "32", "33"],
    present: true,
  },
  {
    name: "מוסאי",
    seats: ["35", "36"],
    present: true,
  },
  {
    name: "שלמה מימון",
    seats: ["40"],
    present: true,
  },
  {
    name: "שלי",
    seats: ["41", "42", "43"],
    present: true,
  },
  {
    name: "דוד",
    seats: ["44", "45"],
    present: true,
  },
  {
    name: "בוסקילה",
    seats: ["46"],
    present: true,
  },
  {
    name: "פרץ",
    seats: ["417", "416", "415", "0414"],
    present: true,
  },
  {
    name: "טיירי",
    seats: ["413"],
    present: true,
  },
  {
    name: "קליין",
    seats: ["412", "411"],
    present: true,
  },
  {
    name: "קרייף",
    seats: ["50", "51", "52", "53"],
    present: true,
  },
  {
    name: "סעדיה",
    seats: ["54"],
    present: true,
  },
  {
    name: "גבאי",
    seats: ["55", "56"],
    present: true,
  },
  {
    name: "עובדיה",
    seats: ["515", "514"],
    present: true,
  },
  {
    name: "אלון",
    seats: ["512", "511"],
    present: true,
  },
  {
    name: "קליינברג",
    seats: ["60", "61"],
    present: true,
  },
  {
    name: "הלוי",
    seats: ["62", "63"],
    present: true,
  },
  {
    name: "בליקשטיין",
    seats: ["64"],
    present: true,
  },
  {
    name: "יפרח",
    seats: ["65", "66"],
    present: true,
  },
  {
    name: "אלחייק",
    seats: ["617", "616"],
    present: true,
  },
  {
    name: "דהן",
    seats: ["615", "614"],
    present: true,
  },
  {
    name: "רביבו",
    seats: ["613", "612", "611"],
    present: true,
  },
  {
    name: "ברששת",
    seats: ["74", "75", "76"],
    present: true,
  },
  {
    name: "קמחי",
    seats: ["717", "716"],
    present: true,
  },
  {
    name: "בנימין",
    seats: ["715", "714"],
    present: true,
  },
  {
    name: "אביטל",
    seats: ["711", "712", "713"],
    present: true,
  },

  {
    name: "אוחנה",
    seats: ["011", "012"],
    present: true,
  },
  {
    name: "מימון",
    seats: ["010", "09"],
    present: true,
  },
  {
    name: "אלעזרה",
    seats: ["07", "08"],
    present: true,
  },
  {
    name: "שפירא",
    seats: ["06", "05"],
    present: true,
  },
  {
    name: "חזן",
    seats: ["04"],
    present: true,
  },
  {
    name: "דוד",
    seats: ["03", "02"],
    present: true,
  },
  {
    name: "שמור",
    seats: [
      "00",
      "01",
      "111",
      "15",
      "14",
      "16",
      "24",
      "313",
      "34",
      "516",
      "517",
      "513",
      "70",
      "71",
      "72",
      "73",
    ],
    present: true,
  },
];

export function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function getCurrentDateDayFirst() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}
export function getCurrentDateDayFirstByGetDate(date: string) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}
export function getCurrentDateNoYear() {
  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${day}-${month}`;
}
export function getHoursAndMinutes(dateTimeString: string) {
  const dateObj = new Date(dateTimeString);
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
// Example usage:
// console.log(getCurrentDate()); // Output: e.g., 2024-04-16

export const dateToShow: DateToShow = {
  hebrew: "עברי",
  number: "לועזי",
};
export const translationsZmanimKeys: TranslationsZmanimKeys = {
  chatzotNight: "חצות הלילה",
  alotHaShachar: "עלות השחר",
  misheyakir: "משיכיר",
  misheyakirMachmir: "משיכיר מחמיר",
  dawn: "שחר",
  sunrise: "זריחה",
  sofZmanShmaMGA16Point1: 'סוף זמן שמע מג"א',
  sofZmanShmaMGA: 'סוף זמן שמע מג"א',
  sofZmanShma: "סוף זמן שמע",
  sofZmanTfillaMGA16Point1: 'סוף זמן תפילה מג"א',
  sofZmanTfillaMGA: 'סוף זמן תפילה מג"א',
  sofZmanTfilla: "סוף זמן תפילה",
  chatzot: "חצות",
  minchaGedola: "מנחה גדולה",
  minchaKetana: "מנחה קטנה",
  plagHaMincha: "פלג המנחה",
  sunset: "שקיעה",
  beinHaShmashos: "בין השמשות",
  dusk: "נטיפות",
  tzeit7083deg: "צאת הכוכבים",
  tzeit85deg: "צאת כוכבים (8.5 מעלות)",
  tzeit42min: "צאת כוכבים (42 דקות)",
  tzeit50min: "צאת כוכבים (50 דקות)",
  tzeit72min: "צאת כוכבים (72 דקות)",
};
export const beautyColorsHex: string[] = [
  "#DC143C", // Crimson
  "#E6E6FA", // Lavender
  "#008000", // Emerald
  "#0F52BA", // Sapphire
  "#DAA520", // Goldenrod
  "#FF7F50", // Coral
  "#9966CC", // Amethyst
  "#40E0D0", // Turquoise
  "#E0115F", // Ruby
  "#EAE0C8", // Pearl
  "#4B0082", // Indigo
  "#FF00FF", // Magenta
  "#FFD700", // Topaz
  "#007FFF", // Azure
  "#E6E200", // Peridot
  "#8A2BE2", // Violet
  "#FF007F", // Rose
  "#007BA7", // Cerulean
  "#FF2400", // Scarlet
  "#00FFFF", // Aqua
];
export interface DateToShow {
  hebrew: "עברי";
  number: "לועזי";
}
export interface OmerDay {
  he: string;
  number: string;
}

export const omerArrayDays: OmerDay[] = [
  {
    he: "יום אחד",
    number: "1th",
  },
  {
    he: "שני ימים",
    number: "2th",
  },
  {
    he: "שלושה ימים",
    number: "3th",
  },
  {
    he: "ארבעה ימים",
    number: "4th",
  },
  {
    he: "חמישה ימים",
    number: "5th",
  },
  {
    he: "שישה ימים",
    number: "6th",
  },
  {
    he: "שבעה ימים",
    number: "7th",
  },
  {
    he: "שמונה ימים",
    number: "8th",
  },
  {
    he: "תשעה ימים",
    number: "9th",
  },
  {
    he: "עשרה ימים",
    number: "10th",
  },
  {
    he: "אחד עשר יום",
    number: "11th",
  },
  {
    he: "שנים עשר יום",
    number: "12th",
  },
  {
    he: "שלושה עשר יום",
    number: "13th",
  },
  {
    he: "ארבעה עשר יום",
    number: "14th",
  },
  {
    he: "חמישה עשר יום",
    number: "15th",
  },
  {
    he: "ששה עשר יום",
    number: "16th",
  },
  {
    he: "שבעה עשר יום",
    number: "17th",
  },
  {
    he: "שמונה עשר יום",
    number: "18th",
  },
  {
    he: "תשעה עשר יום",
    number: "19th",
  },
  {
    he: "עשרים ימים",
    number: "20th",
  },
  {
    he: "עשרים ואחד יום",
    number: "21th",
  },
  {
    he: "עשרים ושנים יום",
    number: "22th",
  },
  {
    he: "עשרים ושלושה יום",
    number: "23th",
  },
  {
    he: "עשרים וארבעה יום",
    number: "24th",
  },
  {
    he: "עשרים וחמישה יום",
    number: "25th",
  },
  {
    he: "עשרים וששה יום",
    number: "26th",
  },
  {
    he: "עשרים ושבעה יום",
    number: "27th",
  },
  {
    he: "עשרים ושמונה יום",
    number: "28th",
  },
  {
    he: "עשרים ותשעה יום",
    number: "29th",
  },
  {
    he: "שלושים ימים",
    number: "30th",
  },
  {
    he: "שלושים ואחד יום",
    number: "31th",
  },
  {
    he: "שלושים ושנים יום",
    number: "32th",
  },
  {
    he: "שלושים ושלושה יום",
    number: "33th",
  },
  {
    he: "שלושים וארבעה יום",
    number: "34th",
  },
  {
    he: "שלושים וחמישה יום",
    number: "35th",
  },
  {
    he: "שלושים וששה יום",
    number: "36th",
  },
  {
    he: "שלושים ושבעה יום",
    number: "37th",
  },
  {
    he: "שלושים ושמונה יום",
    number: "38th",
  },
  {
    he: "שלושים ותשעה יום",
    number: "39th",
  },
  {
    he: "ארבעים ימים",
    number: "40th",
  },
  {
    he: "ארבעים ואחד יום",
    number: "41th",
  },
  {
    he: "ארבעים ושנים יום",
    number: "42th",
  },
  {
    he: "ארבעים ושלושה יום",
    number: "43th",
  },
  {
    he: "ארבעים וארבעה יום",
    number: "44th",
  },
  {
    he: "ארבעים וחמישה יום",
    number: "45th",
  },
  {
    he: "ארבעים וששה יום",
    number: "46th",
  },
  {
    he: "ארבעים ושבעה יום",
    number: "47th",
  },
  {
    he: "ארבעים ושמונה יום",
    number: "48th",
  },
  {
    he: "ארבעים ותשעה יום",
    number: "49th",
  },
  {
    he: "חמישים ימים",
    number: "50th",
  },
];
export interface KidushFood {
  category: string;
  items: KidushCategoryOption[];
}
export interface KidushCategoryOption {
  id: string;
  name: string;
  quantities: string;
}
export const kidushFoods: KidushFood[] = [
  {
    category: "מאפים",
    items: [
      { id: "aBcDeF123456789", name: "חלה", quantities: " לחם אחד" },
      { id: "bCdEfG234567890", name: "פיתות", quantities: " שש יחידות" },
      { id: "cDeFgH345678901", name: "פיצות", quantities: " שלוש יחידות" },
      { id: "dEfGhI456789012", name: "בורקסים", quantities: " עשרה יחידות" },
      { id: "eFgHiJ567890123", name: "מאפה", quantities: "אחת" },
      { id: "fGhIjK678901234", name: "בייגלס", quantities: "שתיים" },
      { id: "gHiJkL789012345", name: "סופגניות", quantities: "עשרה" },
      { id: "hIjKlM890123456", name: "דרזנים", quantities: "שניים" },
      { id: "iJkLmN901234567", name: "דונאטס", quantities: "שניים" },
      { id: "jKlMnO012345678", name: "קרואסונים", quantities: "שמונה" },
      { id: "kLmNoP123456789", name: "מאפים מתוקים", quantities: "עשרה" },
      { id: "lMnOpQ234567890", name: "באבקה", quantities: "שלושה" },
      { id: "mNoPqR345678901", name: "לחמים", quantities: "אחד" },
      { id: "nOpQrS456789012", name: "פיתות דגם", quantities: "שש" },
      { id: "opQrSt567890123", name: "מאפים קטנים", quantities: "עשרה" },
      { id: "pQrStU678901234", name: "פיצות קטנות", quantities: "עשרה" },
      { id: "qRsTuV789012345", name: "טורטילה", quantities: "שלושה" },
      { id: "rStUvW890123456", name: "מקרוני", quantities: "שניים" },
      { id: "sTuVwX901234567", name: "מאפים אספרסו", quantities: "שניים" },
      { id: "tUvWxY012345678", name: "פיצה איטלקית", quantities: "עשרה" },
    ],
  },
  {
    category: "שתיה",
    items: [
      { id: "uVwXyZ123456789", name: "יין יקידוש", quantities: "בקבוק" },
      { id: "vWxYzA234567890", name: "יין לקידוש", quantities: " בקבוק יחיד" },
      { id: "wXyZaB345678901", name: "חלב", quantities: " ליטר יחיד" },
      { id: "xYzAbC456789012", name: "תה", quantities: " חמישה כוסות" },
      { id: "yZaBcD567890123", name: "מיץ", quantities: " ליטר יחיד" },
      { id: "zAbCdE678901234", name: "קפה", quantities: "שני" },
      { id: "AbCdEf789012345", name: "סודה", quantities: "שתיים" },
      { id: "BcDeFg890123456", name: "מיץ תפוזים", quantities: "שתיים" },
      { id: "cDeFgH901234567", name: "מיץ לימון", quantities: "שניים" },
      { id: "dEfGhI012345678", name: "מיץ ענבים", quantities: "שלוש" },
      { id: "eFgHiJ123456789", name: "מיץ אפרסק", quantities: "ארבע" },
      { id: "fGhIjK234567890", name: "קולה", quantities: "ספק" },
      { id: "gHiJkL345678901", name: "מיץ גזר", quantities: "שלושה" },
      { id: "hIjKlM456789012", name: "מיץ בטטה", quantities: "שבעה" },
      { id: "iJkLmN567890123", name: "מיץ תפוחים", quantities: "שמונה" },
      { id: "jKlMnO678901234", name: "שקולדה", quantities: "שני" },
      { id: "kLmNoP789012345", name: "מיץ דלעת", quantities: "שתיים" },
      { id: "lMnOpQ890123456", name: "מיץ עגבניה", quantities: "שלושה" },
      { id: "mNoPqR901234567", name: "קוקטייל", quantities: "שתיים" },
      { id: "nOpQrS012345678", name: "מיץ ברנר", quantities: "שתיים" },
    ],
  },
  {
    category: "מבושלים",
    items: [
      { id: "opQrSt123456789", name: "פתטיני", quantities: "ארבעה" },
      { id: "pQrStU234567890", name: "פסטה", quantities: "שניים" },
      { id: "qRsTuV345678901", name: "סופר", quantities: "שני" },
      { id: "rStUvW456789012", name: "סיר", quantities: "שלושה" },
      { id: "sTuVwX567890123", name: "ספגטי", quantities: "שתיים" },
      { id: "tUvWxY678901234", name: "קלוס", quantities: "שניים" },
      { id: "uVwXyZ789012345", name: "פסטרמה", quantities: "שתיים" },
      { id: "vWxYzA890123456", name: "ברוקולי", quantities: "שתיים" },
      { id: "wXyZaB901234567", name: "פסטה ארץ", quantities: "שתיים" },
      { id: "xYzAbC012345678", name: "מטר", quantities: "שלושה" },
      { id: "yZaBcD123456789", name: "שטיח", quantities: "שתיים" },
      { id: "zAbCdE234567890", name: "קיש", quantities: "שני" },
      { id: "AbCdEf345678901", name: "מאפה", quantities: "אחת" },
      { id: "BcDeFg456789012", name: "מגש כף", quantities: "שניים" },
      { id: "cDeFgH567890123", name: "מלח", quantities: "שלושה" },
      { id: "dEfGhI678901234", name: "פיטוס", quantities: "שתיים" },
      { id: "eFgHiJ789012345", name: "מרק", quantities: "שלושה" },
      { id: "fGhIjK890123456", name: "מלח", quantities: "שניים" },
      { id: "gHiJkL901234567", name: "כסף", quantities: "שלושה" },
      { id: "hIjKlM012345678", name: "מילון", quantities: "שני" },
    ],
  },
  {
    category: "סלטים",
    items: [
      { id: "iJkLmN123456789", name: "סלט ירקות", quantities: "שניים" },
      { id: "jKlMnO234567890", name: "סלט פירות", quantities: "שתיים" },
      { id: "kLmNoP345678901", name: "סלט חסות", quantities: "שניים" },
      { id: "lMnOpQ456789012", name: "סלט תירס", quantities: "שלושה" },
      { id: "mNoPqR567890123", name: "סלט עגבניות", quantities: "שתיים" },
      { id: "nOpQrS678901234", name: "סלט חסות", quantities: "שניים" },
      { id: "opQrSt789012345", name: "סלט ירקות", quantities: "שלושה" },
      { id: "pQrStU890123456", name: "סלט קיש", quantities: "שתיים" },
      { id: "qRsTuV901234567", name: "סלט דגים", quantities: "שלושה" },
      { id: "rStUvW012345678", name: "סלט פירות", quantities: "שניים" },
      { id: "sTuVwX123456789", name: "סלט ירקות", quantities: "שלושה" },
      { id: "tUvWxY234567890", name: "סלט חסות", quantities: "שניים" },
    ],
  },
  {
    category: "שונות",
    items: [
      { id: "uVwXyZ345678901", name: "חטיף ג׳ינג'ינה", quantities: "אחד" },
      { id: "vWxYzA456789012", name: "מסטיק תות", quantities: "שניים" },
      { id: "wXyZaB567890123", name: "מתיק", quantities: "שלושה" },
      { id: "xYzAbC678901234", name: "סנאק", quantities: "ארבעה" },
      { id: "yZaBcD789012345", name: "ברמלדה", quantities: "חמישה" },
      { id: "zAbCdE890123456", name: "קרמית רבה", quantities: "ששה" },
      { id: "AbCdEf901234567", name: "מסקרה", quantities: "שבעה" },
      { id: "BcDeFg012345678", name: "סיני", quantities: "שמונה" },
      { id: "cDeFgH123456789", name: "אטריות", quantities: "תשעה" },
      { id: "dEfGhI234567890", name: "שוקולד צ׳יפס", quantities: "עשרה" },
      { id: "eFgHiJ345678901", name: "תפוציצ׳יקלום", quantities: "אחת" },
      { id: "fGhIjK456789012", name: "שוקולד", quantities: "שתיים" },
      { id: "gHiJkL567890123", name: "גלידה", quantities: "שלושה" },
      { id: "hIjKlM678901234", name: "גרנולה", quantities: "ארבעה" },
      { id: "iJkLmN789012345", name: "חטיפי כותנה", quantities: "חמישה" },
      { id: "jKlMnO890123456", name: "שוקו קר", quantities: "ששה" },
      { id: "kLmNoP901234567", name: "טפלטור", quantities: "שבעה" },
      { id: "lMnOpQ012345678", name: "שוקולד מריר", quantities: "שמונה" },
      { id: "mNoPqR123456789", name: "אוראו", quantities: "תשעה" },
      { id: "nOpQrS234567890", name: "שטראוס", quantities: "עשרה" },
    ],
  },
  {
    category: "כלי הגשה",
    items: [
      { id: "opQrSt345678901", name: "צלחת", quantities: "אחת" },
      { id: "pQrStU456789012", name: "סכו״ם", quantities: "שניים" },
      { id: "qRsTuV567890123", name: "קערה", quantities: "שלושה" },
      { id: "rStUvW678901234", name: "כוס", quantities: "ארבעה" },
      { id: "sTuVwX789012345", name: "מגש", quantities: "חמישה" },
      { id: "tUvWxY890123456", name: "מכונת קפה", quantities: "ששה" },
      { id: "uVwXyZ901234567", name: "שנק", quantities: "שבעה" },
      { id: "vWxYzA012345678", name: "מגבת", quantities: "שמונה" },
      { id: "wXyZaB123456789", name: "מקצוע", quantities: "תשעה" },
      { id: "xYzAbC234567890", name: "אספרסו", quantities: "עשרה" },
      { id: "yZaBcD345678901", name: "מקרה", quantities: "אחד" },
      { id: "zAbCdE456789012", name: "שוקולד", quantities: "שתיים" },
      { id: "AbCdEf567890123", name: "ממרח", quantities: "שלושה" },
      { id: "BcDeFg678901234", name: "משקה", quantities: "ארבעה" },
      { id: "cDeFgH789012345", name: "מזרקה", quantities: "חמישה" },
      { id: "dEfGhI890123456", name: "קפה", quantities: "ששה" },
      { id: "eFgHiJ901234567", name: "שוקולדה", quantities: "שבעה" },
      { id: "fGhIjK012345678", name: "כפית", quantities: "שמונה" },
      { id: "gHiJkL123456789", name: "גביע", quantities: "תשעה" },
      { id: "hIjKlM234567890", name: "מקל", quantities: "עשרה" },
    ],
  },
  {
    category: "ממתקים",
    items: [
      { id: "iJkLmN345678901", name: "סוכריות", quantities: "אחד" },
      { id: "jKlMnO456789012", name: "ממתקים", quantities: "שניים" },
      { id: "kLmNoP567890123", name: "חטיפי", quantities: "שלושה" },
      { id: "lMnOpQ678901234", name: "ממתק", quantities: "שניים" },
      { id: "mNoPqR789012345", name: "קייטרינג", quantities: "שלושה" },
      { id: "nOpQrS890123456", name: "ממתקים יבשים", quantities: "שניים" },
      { id: "opQrSt901234567", name: "סוכריית חמאה", quantities: "שלושה" },
      { id: "pQrStU012345678", name: "ממתקים", quantities: "ארבעה" },
      { id: "qRsTuV123456789", name: "קוקיז", quantities: "חמישה" },
      { id: "rStUvW234567890", name: "פאי", quantities: "ששה" },
      { id: "sTuVwX345678901", name: "בלגים", quantities: "שבעה" },
      { id: "tUvWxY456789012", name: "אזורים", quantities: "תשעה" },
      { id: "uVwXyZ567890123", name: "ממתקים שוקולדיים", quantities: "עשרה" },
      { id: "vWxYzA678901234", name: "ממתקים", quantities: "אחד" },
      { id: "wXyZaB789012345", name: "סוכריות", quantities: "שניים" },
      { id: "xYzAbC890123456", name: "מצקה", quantities: "שלושה" },
      { id: "yZaBcD901234567", name: "ממתק", quantities: "שניים" },
      { id: "zAbCdE012345678", name: "פיצוחים", quantities: "שלושה" },
      { id: "AbCdEf123456789", name: "קינדר", quantities: "ארבעה" },
      { id: "BcDeFg234567890", name: "מסופחים", quantities: "חמישה" },
    ],
  },
];
