import { IMessage } from "./IMessage";
import { IRoom } from "./IRoom";

export type TUserInviteList = {
  _id: string;
  name: string;
};

export interface IUser {
  rooms: IRoom[];
  inviteList: TUserInviteList[];
  selectedRoomId: null | string;
  directoryIsOpen: boolean;
  username: string | null;
  userId: string | null;
  isCreateRoomModalShow: boolean;
  messages: IMessage[];
}

export interface IUserCredentials {
  email: string;
  password: string;
  username?: string;
}
