import { Schema, model, Document } from "mongoose";
import { IRoom } from "../types/IRoom";

const RoomSchema: Schema = new Schema({
  users: { type: Array, ref: "User" },

  messages: { type: Array },

  inviteList: { type: [Schema.Types.ObjectId], ref: "User" },

  blackList: { type: [Schema.Types.ObjectId], ref: "User" },

  name: { type: String, require: true },
});

export type IRoomSchema = Document & IRoom;

export default model<IRoomSchema>("Room", RoomSchema);
