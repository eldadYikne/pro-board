export default interface User {
  name: string;
  seats: SeatNumber[];
  present: boolean;
  id: string;
  debts: Debt[];
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
export interface Debt {
  sum: number;
  date: string;
  reason: string;
}
export type DebtReason = "עלייה לתורה" | "תרומה" | "לרפואה" | "לעילוי נשמת";
