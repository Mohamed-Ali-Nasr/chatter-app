import { IUser } from "./IUser";

export type IRoom = {
  _id: string;
  users: IUser[];
  messages: string[];
  inviteList: string[] | IUser[];
  blackList: string[] | IUser[];
  name: string;
};

export interface InviteData {
  id: string;
  name: string;
  roomId: string;
}
