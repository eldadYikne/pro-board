export default interface KUser {
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
  isPaid: boolean;
}
export type DebtReason = "עלייה לתורה" | "תרומה" | "לרפואה" | "לעילוי נשמת";
export interface Filter {
  key: keyof Filters;
  text: string;
  type: "text" | "checkBox";
}
export interface Filters {
  name: string;
  debt: boolean;
}
