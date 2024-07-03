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
