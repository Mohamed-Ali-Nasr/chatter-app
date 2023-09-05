import { useAppSelector } from "hooks/redux-hooks";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { selectAuth } from "store/auth/authSlice";

const Navbar = () => {
  const { authLoading, isAuthenticated } = useAppSelector(selectAuth);

  return (
    <div className="container mx-auto flex justify-between items-center h-24">
      <h1 className="font-DMSans text-3xl text-main-blue font-bold tracking-tight">
        Chatter
      </h1>

      {authLoading ? (
        <div className="py-3 px-10 bg-transparent border-2 border-slate-400 rounded-lg text-white font-DMSans text-base">
          <Oval width="30px" height="30px" color="#fff" />
        </div>
      ) : isAuthenticated ? (
        <Link
          className="py-3 px-10 bg-transparent border-2 border-slate-400 rounded-lg text-white font-DMSans text-base"
          to={"/chat"}
        >
          Chat
        </Link>
      ) : (
        <Link
          className="py-3 px-10 bg-transparent border-2 border-slate-400 rounded-lg text-white font-DMSans text-base"
          to={"/sign-in"}
        >
          Login / Sign up
        </Link>
      )}
    </div>
  );
};

export default Navbar;
