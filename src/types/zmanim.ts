export interface Zman {
  name: string;
  time: string;
}

export interface TranslationsZmanimKeys {
  chatzotNight: string;
  alotHaShachar: string;
  misheyakir: string;
  misheyakirMachmir: string;
  dawn: string;
  sunrise: string;
  sofZmanShmaMGA16Point1: string;
  sofZmanShmaMGA: string;
  sofZmanShma: string;
  sofZmanTfillaMGA16Point1: string;
  sofZmanTfillaMGA: string;
  sofZmanTfilla: string;
  chatzot: string;
  minchaGedola: string;
  minchaKetana: string;
  plagHaMincha: string;
  sunset: string;
  beinHaShmashos: string;
  dusk: string;
  tzeit7083deg: string;
  tzeit85deg: string;
  tzeit42min: string;
  tzeit50min: string;
  tzeit72min: string;
}
export interface TimesDataScheme {
  isMoridHatal: boolean;
  hebrewDate: string;
  holiday: string;
  sfiratOmer: string;
  roshChodesh: string;
  lastTimeDataUpdated: number;
  dayTimes: {
    name: string;
    time: string;
  }[];
  sahabatTimes: {
    havdala: string;
    parasha: string;
    candles: string;
  };
  id: string;
}
