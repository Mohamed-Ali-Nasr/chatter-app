import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";
import { IMessage } from "types/IMessage";
import { IRoom } from "types/IRoom";
import { IUser, TUserInviteList } from "types/IUser";

const initialState: IUser = {
  rooms: [],
  inviteList: [],
  selectedRoomId: null,
  directoryIsOpen: false,
  username: null,
  userId: null,
  isCreateRoomModalShow: false,
  messages: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<IRoom[]>) => {
      state.rooms = action.payload;
    },

    setInviteList: (state, action: PayloadAction<TUserInviteList[]>) => {
      state.inviteList = action.payload;
    },

    selectRoom: (state, action: PayloadAction<string | null>) => {
      state.selectedRoomId = action.payload;
    },

    setDirectory: (state, action: PayloadAction<boolean>) => {
      state.directoryIsOpen = action.payload;
    },

    setCredentials: (
      state,
      action: PayloadAction<{ username: string; userId: string }>
    ) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
    },

    acceptInvite: (
      state,
      action: PayloadAction<{ room: IRoom; roomId: string }>
    ) => {
      const inviteList = state.inviteList.filter(
        (invite) => invite._id !== action.payload.roomId
      );
      state.rooms.push(action.payload.room);
      state.inviteList = inviteList;
    },

    ignoreInvite: (state, action: PayloadAction<string>) => {
      state.inviteList = state.inviteList.filter(
        (invite) => invite._id !== action.payload
      );
    },

    userJoinedRoom: (
      state,
      action: PayloadAction<{
        roomId: string;
        userId: string;
        username: string;
      }>
    ) => {
      const roomIndex = state.rooms.findIndex(
        (room) => room._id === action.payload.roomId
      );
      state.rooms[roomIndex].inviteList = state.rooms[
        roomIndex
      ].inviteList.filter(
        (invitedUser) => invitedUser._id !== action.payload.userId
      );
      state.rooms[roomIndex].users.push({
        role: "7610",
        userId: action.payload.userId,
        username: action.payload.username,
      });
    },

    addUserToInviteList: (
      state,
      action: PayloadAction<{ roomId: string; id: string; name: string }>
    ) => {
      const roomIndex = state.rooms.findIndex(
        (room) => room._id === action.payload.roomId
      );
      state.rooms[roomIndex].inviteList = [
        ...state.rooms[roomIndex].inviteList,
        { _id: action.payload.id, name: action.payload.name },
      ];
    },

    deleteUserFromInviteList: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>
    ) => {
      const roomIndex = state.rooms.findIndex(
        (room) => room._id === action.payload.roomId
      );
      state.rooms[roomIndex].inviteList = state.rooms[
        roomIndex
      ].inviteList.filter(
        (invitedUser) => invitedUser._id !== action.payload.userId
      );
    },

    toggleCreateRoomModal: (state) => {
      state.isCreateRoomModalShow = !state.isCreateRoomModalShow;
    },

    addRoom: (state, action: PayloadAction<IRoom>) => {
      state.rooms.push(action.payload);
    },

    addToInviteList: (state, action: PayloadAction<TUserInviteList>) => {
      const isInvited = state.inviteList.find(
        (invite) => invite._id === action.payload._id
      );
      if (!isInvited) {
        state.inviteList = [...state.inviteList, action.payload];
      }
    },

    removeUserFromRoom: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>
    ) => {
      const roomIndex = state.rooms.findIndex(
        (room) => room._id === action.payload.roomId
      );
      state.rooms[roomIndex].users = state.rooms[roomIndex].users.filter(
        (user) => user.userId !== action.payload.userId
      );
    },

    removeRoom: (state, action: PayloadAction<string>) => {
      state.rooms = state.rooms.filter((room) => room._id !== action.payload);
    },

    addUserToBlackList: (
      state,
      action: PayloadAction<{
        roomId: string;
        userId: string;
        username: string;
      }>
    ) => {
      const roomIndex = state.rooms.findIndex(
        (room) => room._id === action.payload.roomId
      );
      state.rooms[roomIndex].blackList.push({
        _id: action.payload.userId,
        name: action.payload.username,
      });
      state.rooms[roomIndex].users = state.rooms[roomIndex].users.filter(
        (user) => user.userId !== action.payload.userId
      );
    },

    removeUserFromBlacklist: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>
    ) => {
      const roomIndex = state.rooms.findIndex(
        (room) => room._id === action.payload.roomId
      );
      state.rooms[roomIndex].blackList = state.rooms[
        roomIndex
      ].blackList.filter(
        (bannedUser) => bannedUser._id !== action.payload.userId
      );
    },

    changeRoomName: (
      state,
      action: PayloadAction<{ roomId: string; newRoomName: string }>
    ) => {
      const roomIndex = state.rooms.findIndex(
        (room) => room._id === action.payload.roomId
      );
      state.rooms[roomIndex].name = action.payload.newRoomName;
    },

    setRoomMessages: (
      state,
      action: PayloadAction<{ roomId: string; messages: IMessage[] }>
    ) => {
      const roomIndex = state.rooms.findIndex(
        (room) => room._id === action.payload.roomId
      );

      state.rooms[roomIndex].messages = action.payload.messages;
    },

    addRoomMessage: (
      state,
      action: PayloadAction<{ roomId: string; messageData: IMessage }>
    ) => {
      const roomIndex = state.rooms.findIndex(
        (room) => room._id === action.payload.roomId
      );

      state.rooms[roomIndex].messages.push(action.payload.messageData);
    },
  },
});

export default userSlice.reducer;

export const userActions = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
