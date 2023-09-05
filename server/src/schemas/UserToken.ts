import { Schema, model, Document } from "mongoose";
import { IUserToken } from "../types/IUserToken";

const UserTokenSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },

  token: { type: String, required: true },

  createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }, // 30 days
});

export type IUserTokenSchema = Document & IUserToken;

export default model<IUserTokenSchema>("UserToken", UserTokenSchema);
