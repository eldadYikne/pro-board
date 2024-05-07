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
