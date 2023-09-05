import { IMessage } from "./IMessage";

export type TRoomUser = {
  userId: string;
  role: "1769" | "2561" | "7610";
  username: string;
};

export type TRoomInviteList = {
  _id: string;
  name: string;
};

export type TRoomSearchUser = {
  _id: string;
  username: string;
  email?: string;
};

export type TRoomBlackList = TRoomInviteList;

export interface IRoom {
  blackList: TRoomBlackList[];
  inviteList: TRoomInviteList[];
  name: string;
  _id: string;
  users: TRoomUser[];
  messages: IMessage[];
}
