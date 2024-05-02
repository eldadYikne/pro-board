export default interface User {
  name: string;
  seats: string[];
  present: boolean;
  id?: string;
}
export interface SeatUser {
  name: string;
  present: boolean;
  seat: SeatNumber;
  id?: string;
}
export interface SeatNumber {
  present: boolean;
  seatNumber: string;
}
