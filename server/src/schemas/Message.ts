import { Document, Schema, model } from "mongoose";
import { IMessage } from "../types/IMessage";

const MessageSchema: Schema = new Schema(
  {
    message: { type: String },

    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },

    senderName: { type: String, ref: "User", required: true },

    img: { type: String },
  },

  { timestamps: true }
);

export type IMessageSchema = Document & IMessage;

export default model<IMessageSchema>("Message", MessageSchema);
