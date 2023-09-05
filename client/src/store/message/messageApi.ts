import { api } from "store/api";
import { IMessage, IUserSendMessage, ImgInfo } from "types/IMessage";

const messageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoomsMessages: builder.mutation<IMessage[], void>({
      query: () => ({
        url: "api/msg",
        method: "GET",
      }),
    }),

    sendMessage: builder.mutation<IMessage, IUserSendMessage>({
      query: ({ message, roomId, img }) => ({
        url: `api/msg/${roomId}`,
        method: "POST",
        body: { roomId, message, img },
      }),
    }),

    getRoomMessages: builder.mutation<IMessage[], string>({
      query: (roomId) => ({
        url: `api/msg/${roomId}`,
        method: "GET",
      }),
    }),

    uploadMessageImg: builder.mutation<ImgInfo, FormData>({
      query: (fromData) => ({
        url: "api/msg-upload-img",
        method: "POST",
        body: fromData,
      }),
    }),
  }),
});

export const {
  useGetAllRoomsMessagesMutation,
  useSendMessageMutation,
  useGetRoomMessagesMutation,
  useUploadMessageImgMutation,
} = messageApi;
