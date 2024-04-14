export default interface User {
  name: string;
  seats?: string[];
  present: boolean;
  id?: string;
}
export default interface Seat {
  name: string;
  present: boolean;
  seat: string;
  id?: string;
}
