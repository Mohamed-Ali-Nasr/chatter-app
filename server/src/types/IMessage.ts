import { IRoom } from "./IRoom";
import { IUser } from "./IUser";

export type IMessage = {
  _id: string;
  message: string;
  senderId: string | IUser;
  roomId: string | IRoom;
  senderName: string | IUser;
  createdAt: Date;
  img: string;
};
