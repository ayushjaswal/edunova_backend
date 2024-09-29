import mongoose, { ObjectId } from "mongoose";

export interface userType{
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  currentIssuedBook: ObjectId;
}