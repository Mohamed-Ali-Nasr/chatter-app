import { api } from "store/api";
import { userActions } from "store/user/userSlice";
import { IRoom } from "types/IRoom";
import { toast } from "react-toastify";

const roomApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRoom: builder.mutation<{ room: IRoom }, string>({
      query: (name) => ({
        url: "api/room",
        method: "POST",
        body: { name },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userActions.addRoom(data.room));
          toast.success("room created successfully");
        } catch (error) {
          toast.error("Sorry! something bad happened! try again later.");
        }
      },
    }),

    deleteRoom: builder.mutation<void, string>({
      query: (roomId) => ({
        url: "api/room/delete",
        method: "POST",
        body: { roomId },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(userActions.removeRoom(arg));
      },
    }),

    editRoomName: builder.mutation<
      void,
      { roomId: string; newRoomName: string }
    >({
      query: ({ roomId, newRoomName }) => ({
        url: "api/room/name",
        method: "POST",
        body: { roomId, newRoomName },
      }),
    }),

    inviteUser: builder.mutation<
      void,
      { roomId: string; invitedUserId: string }
    >({
      query: ({ roomId, invitedUserId }) => ({
        url: "api/room/invite",
        method: "PUT",
        body: { roomId, invitedUserId },
      }),
    }),

    bannedUser: builder.mutation<
      void,
      { roomId: string; bannedUserId: string }
    >({
      query: ({ roomId, bannedUserId }) => ({
        url: "api/room/blacklist",
        method: "PUT",
        body: { roomId, bannedUserId },
      }),
    }),

    cancelUserInvite: builder.mutation<
      void,
      { roomId: string; canceledUserId: string }
    >({
      query: ({ roomId, canceledUserId }) => ({
        url: "api/room/cancel-invite",
        method: "POST",
        body: { roomId, canceledUserId },
      }),
    }),

    kickUser: builder.mutation<void, { roomId: string; kickedUserId: string }>({
      query: ({ roomId, kickedUserId }) => ({
        url: "api/room/kick-user",
        method: "POST",
        body: { roomId, kickedUserId },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            userActions.removeUserFromRoom({
              roomId: arg.roomId,
              userId: arg.kickedUserId,
            })
          );
          toast.success("user kicked successfully");
        } catch (error) {
          toast.error("cant kick user! try again later");
        }
      },
    }),

    unBannedUser: builder.mutation<
      void,
      { roomId: string; bannedUserId: string }
    >({
      query: ({ roomId, bannedUserId }) => ({
        url: "api/room/unban-user",
        method: "POST",
        body: { roomId, bannedUserId },
      }),
    }),

    userLeaveRoom: builder.mutation<void, { roomId: string; userId: string }>({
      query: ({ roomId, userId }) => ({
        url: "api/room/leave",
        method: "POST",
        body: { roomId, userId },
      }),
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useEditRoomNameMutation,
  useInviteUserMutation,
  useBannedUserMutation,
  useCancelUserInviteMutation,
  useKickUserMutation,
  useUnBannedUserMutation,
  useUserLeaveRoomMutation,
} = roomApi;
