import { toast } from "react-toastify";
import { api } from "store/api";
import { userActions } from "./userSlice";
import { TUserInviteList } from "types/IUser";
import { IRoom, TRoomSearchUser } from "types/IRoom";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.mutation<TRoomSearchUser[], void>({
      query: () => ({
        url: `api/user/get-users`,
        method: "GET",
      }),
    }),

    getInviteList: builder.mutation<Array<TUserInviteList>, void>({
      query: () => ({
        url: "api/user/invited-list",
        method: "GET",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: inviteList } = await queryFulfilled;
          dispatch(userActions.setInviteList(inviteList));
          // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),

    getUserRooms: builder.mutation<Array<IRoom>, void>({
      query: () => ({
        url: "api/user/rooms",
        method: "GET",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: rooms } = await queryFulfilled;
          dispatch(userActions.setRooms(rooms));
        } catch (error) {
          toast.error("Sorry! something bad happened! try again later.");
        }
      },
    }),

    userAcceptInvite: builder.mutation<
      { room: IRoom },
      { roomId: string; userId: string }
    >({
      query: ({ roomId, userId }) => ({
        url: "api/user/accept-invite",
        method: "POST",
        body: { roomId, userId },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            userActions.acceptInvite({ room: data.room, roomId: data.room._id })
          );
        } catch (error) {
          toast.error("cant accept the invite");
        }
      },
    }),

    userIgnoreInvite: builder.mutation<{ roomId: string }, string>({
      query: (roomId) => ({
        url: "api/user/ignore-invite",
        method: "POST",
        body: { roomId },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userActions.ignoreInvite(data.roomId));
        } catch (error) {
          toast.error("cant ignore the invite");
        }
      },
    }),

    userSearch: builder.mutation<
      TRoomSearchUser[],
      { query: string; roomId: string }
    >({
      query: ({ query, roomId }) => ({
        url: "api/user/search",
        method: "POST",
        body: { query, roomId },
      }),
    }),
  }),
});

export const {
  useGetAllUsersMutation,
  useGetInviteListMutation,
  useGetUserRoomsMutation,
  useUserAcceptInviteMutation,
  useUserIgnoreInviteMutation,
  useUserSearchMutation,
} = userApi;
