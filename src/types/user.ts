import { Types } from "mongoose";

export default interface User {
  name: string;
  seats?: string[];
  present: boolean;
  _id?: Types.ObjectId;
}
