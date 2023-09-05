import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import ChatLoader from "./ChatLoader";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { selectAuth, authActions } from "store/auth/authSlice";
import { useRefreshMutation } from "store/auth/authApi";

const PersistLogin = () => {
  const { token } = useAppSelector(selectAuth);

  const dispatch = useAppDispatch();

  const [refresh, { isLoading }] = useRefreshMutation();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh().unwrap();
        dispatch(authActions.setUserAuthenticated(true));
      } catch (err) {
        dispatch(authActions.setUserAuthenticated(false));
      }
    };

    if (!token) verifyRefreshToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  let content: React.ReactNode;

  if (isLoading) content = <ChatLoader />;
  else content = <Outlet />;

  return content;
};

export default PersistLogin;
