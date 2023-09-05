import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ChatLoader from "./ChatLoader";
import { useGetAllRoomsMessagesMutation } from "store/message/messageApi";
import {
  useGetInviteListMutation,
  useGetUserRoomsMutation,
} from "store/user/userApi";
import { useAppSelector } from "hooks/redux-hooks";
import { selectAuth } from "store/auth/authSlice";

const Prefetch = () => {
  const navigate = useNavigate();

  const { isAuthenticated, authLoading: isAuthLoading } =
    useAppSelector(selectAuth);

  const [
    getUserRooms,
    { isLoading: isLoadingToGetUserRooms, status: getUserRoomsStatus },
  ] = useGetUserRoomsMutation();

  const [
    getInviteList,
    { isLoading: isLoadingGetInviteList, status: getGetInviteListStatus },
  ] = useGetInviteListMutation();

  const [
    getAllRoomsMessage,
    {
      isLoading: isLoadingToGetAllRoomMessages,
      status: getAllRoomMessagesStatus,
    },
  ] = useGetAllRoomsMessagesMutation();

  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        getUserRooms();
        getInviteList();
        getAllRoomsMessage();
      } else {
        navigate("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading]);

  let content: React.ReactNode;

  if (
    isLoadingToGetUserRooms &&
    isLoadingGetInviteList &&
    isLoadingToGetAllRoomMessages
  ) {
    content = <ChatLoader />;
  } else if (
    (getUserRoomsStatus &&
      getGetInviteListStatus &&
      getAllRoomMessagesStatus) === "fulfilled"
  ) {
    content = <Outlet />;
  }

  return content;
};

export default Prefetch;
