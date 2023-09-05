import { api } from "store/api";
import { authActions } from "./authSlice";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import { userActions } from "store/user/userSlice";
import { IUserCredentials } from "types/IUser";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<void, IUserCredentials>({
      query: (userCredentials) => ({
        url: "api/auth/register",
        method: "POST",
        body: { ...userCredentials },
      }),
    }),

    login: builder.mutation<{ accessToken: string }, IUserCredentials>({
      query: (userCredentials) => ({
        url: "api/auth/login",
        method: "POST",
        body: { ...userCredentials },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          dispatch(authActions.setToken(accessToken));
          const decodedAccessToken = jwt_decode<{
            id: string;
            username: string;
          }>(accessToken);

          dispatch(
            userActions.setCredentials({
              userId: decodedAccessToken.id,
              username: decodedAccessToken.username,
            })
          );
          // eslint-disable-next-line no-empty
        } catch (err) {}
      },
    }),

    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "api/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          const decodedAccessToken = jwt_decode<{
            id: string;
            username: string;
          }>(accessToken);

          dispatch(
            userActions.setCredentials({
              userId: decodedAccessToken.id,
              username: decodedAccessToken.username,
            })
          );
          dispatch(authActions.setToken(accessToken));
          // eslint-disable-next-line no-empty
        } catch (err) {}
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "api/auth/logout",
        method: "GET",
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("logged out successfully");
          // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
