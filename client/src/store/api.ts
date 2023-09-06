import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "store";
import { authActions } from "store/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,

  credentials: "include",

  redirect: "follow",

  mode: "cors",

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) headers.set("authorization", `Bearer ${token}`);

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    const refreshResult = await baseQuery(
      `api/auth/refresh`,
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(authActions.setToken(refreshResult.data as string));
      result = await baseQuery(args, api, extraOptions);
    } else {
      await baseQuery(`api/auth/logout`, api, extraOptions);
      api.dispatch(authActions.logOut({ token: null, authStatus: false }));
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
  tagTypes: ["User", "Auth", "Room", "Message"],
  keepUnusedDataFor: 5,
});
