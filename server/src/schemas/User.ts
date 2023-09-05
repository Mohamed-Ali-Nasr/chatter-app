import { Document, Schema, model } from "mongoose";
import { IUser } from "../types/IUser";

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, min: 5, max: 35, unique: true },

    email: { type: String, required: true, max: 50, unique: true },

    password: { type: String, required: true, min: 5 },
  },

  { timestamps: true }
);

export type IUserSchema = Document & IUser;

export default model<IUserSchema>("User", UserSchema);
