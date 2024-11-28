import { TimeObj } from "../types/board";

export function checkIsPast24Hours(stringDate: string) {
  // Get the current time in milliseconds
  const currentTime = new Date().getTime();
  let date = new Date(stringDate);
  // Get the time of the provided date in milliseconds
  const providedTime = date.getTime();

  // Calculate the difference in milliseconds
  const difference = currentTime - providedTime;

  // Calculate the number of milliseconds in 24 hours
  const millisecondsIn24Hours = 24 * 60 * 60 * 1000;

  // Check if the difference is less than the number of milliseconds in 24 hours
  return difference >= millisecondsIn24Hours;
}
export function isTimeBetween0000And0030() {
  // Extract the hours and minutes from the provided date
  let date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Check if the time is between 00:00 and 00:30
  return hours === 0 && minutes >= 0 && minutes <= 30;
}
export function isTimeBetween0000And0130() {
  // Extract the hours and minutes from the provided date
  let date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Check if the time is between 00:00 and 01:30
  return (hours === 0 && minutes >= 0) || (hours === 1 && minutes <= 30);
}
export function checkIsPast3Hours(stringDate: string) {
  const currentTime = new Date().getTime();
  let date = new Date(stringDate);
  const providedTime = date.getTime();
  const difference = currentTime - providedTime;
  const millisecondsIn3Hours = 3 * 60 * 60 * 1000;
  console.log(
    "checkIsPast3Hours",
    stringDate,
    providedTime,
    difference,
    millisecondsIn3Hours,
    difference >= millisecondsIn3Hours
  );
  return difference >= millisecondsIn3Hours;
}
export function generateRandomId() {
  let length = 15;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomId;
}

export function getCurrentDate(): string {
  const today: Date = new Date();
  const year: number = today.getFullYear();
  let month: number | string = today.getMonth() + 1;
  let day: number | string = today.getDate();

  // Ensure month and day are formatted as two digits if less than 10
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
}
export function getLastSunday() {
  const today = new Date(); // Get the current date
  const dayOfWeek = today.getDay(); // Get the current day of the week (0 = Sunday)
  const daysToSubtract = dayOfWeek === 0 ? 7 : dayOfWeek; // Days to go back to the last Sunday
  const lastSunday = new Date(today); // Clone the current date
  lastSunday.setDate(today.getDate() - daysToSubtract); // Subtract days to reach the last Sunday
  return lastSunday;
}

export function isWithinSevenDaysFromLastSunday(date: string) {
  const today = new Date(date);
  const dayOfWeek = today.getDay(); // Get the current day of the week (0 = Sunday)
  const dayToCheck = 6;
  // Calculate last Sunday's date
  const daysToSubtract = dayOfWeek === 0 ? dayToCheck : dayOfWeek;
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - daysToSubtract);

  // Calculate the date dayToCheck days after the last Sunday
  const sevenDaysFromLastSunday = new Date(lastSunday);
  sevenDaysFromLastSunday.setDate(lastSunday.getDate() + dayToCheck);

  // Check if today is within the range of last Sunday to dayToCheck days after
  return today <= sevenDaysFromLastSunday;
}

export function isPastSixDays(timestamp: TimeObj) {
  // Convert Firestore timestamp to a JavaScript Date object
  const inputDate = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6
  );

  const today = new Date(); // Current date
  const sixDaysAgo = new Date(); // Clone current date
  sixDaysAgo.setDate(today.getDate() - 6); // Subtract 6 days from today
  console.log("isWithinSevenDaysFromLastSunday sixDaysAgo", sixDaysAgo);
  console.log(" isWithinSevenDaysFromLastSunday inputDate", timestamp);
  // Compare the input date with six days ago
  return inputDate < sixDaysAgo;
}
