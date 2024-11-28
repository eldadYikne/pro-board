export interface RowOfSeats {
  id: string;
  rectangles: Seat[];
  rotation: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Seat {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  id: string;
  rotation: number;
  userId: string;
  username: string;
}
